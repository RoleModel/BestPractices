# RoleModel AWS S3 and SES setup

1. Create new AWS account:
   1. Under Caleb Wood’s name and company phone number (527371) and RoleModel address.
   2. Use RoleModel credit temporarily
   3. Use basic tier to avoid $30/month charge
2. Create accounts payable customer user
   1. Navigate to IAM console
   2. Create a new User for payable account (<PartnerName>-Accounts-Payable)
   3. Check Provide user acces to the AWS Management Console
   4. Proceed
   5. Choose “Attach policies directly”
   6. Add “Billing” permission policy
   7. Copy account details into 1Password (url, name, pwd)
   8. While this user has the policy, you still need to activate IAM access ([docs](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/security_iam_id-based-policy-examples.html#billing-example-policies))
      1. Open menu in top right and navigate to “Account”
      2. Scroll down and Edit IAM user and role access to Billing information
      3. Check “Activate IAM access”
   9. Send partner instructions for adding a card: [[AWS Partner Billable User Setup Instructions]]
   10. Once partner has added card, remove temporary RoleModel card and make that card the default payment method.
       1. Top right menu -> “Account”
       2. Scroll down in left nav to “Payment preferences”
3. Create SES Staging User
   1. Navigate to Amazon SES
   2. Click on “SMTP Settings”
   3. Click “Create SMTP Credentials”
   4. Change name to “<PartnerName>-SES-User-Staging”
   5. Create user and copy credentials into 1P and return to SES dasboard
   6. Navigate to IAM Users and click on Staging SES users
   7. Under the “Permissions policies” card, click the plus icon next to the policy to edit
   8. Add  following after “resource” declaration for staging mail limiting and save.
   ```JSON
   "Condition": {
       "ForAllValues:StringLike": {
         "ses:Recipients": [
             "*@<partner>.com",
             "*@rolemodelsoftware.com"
         ]
      }
   }
   ```
   9. **TODO:** Should the resource be set to a certain configuration set?
5. Create Identity
   1. Navigate to “Identities” in left nav
   2. Create Identity
   3. Add domain for your partner e.i.<partner>.com
   4. Accept default config and create Identity
   5. Verify the domain
      1. Will need to reach out to get access and add records that AWS gives to their domain setup. Expand “Publish DNS records” to download CSV
   6. Add the following code to the rails application
   ```ruby
      # app/mailers/application_mailer.rb
      class ApplicationMailer < ActionMailer::Base
        default from: ENV.fetch('SMTP_SENDER', nil)
        ...

      # production.rb
      config.x.mail_from = %(#{ENV.fetch('SMTP_SENDER', nil)})
      config.action_mailer.delivery_method = :smtp
      config.action_mailer.perform_deliveries = true
      config.action_mailer.smtp_settings = {
         address: 'email-smtp.us-east-1.amazonaws.com',
         user_name: ENV['AWS_SES_USER'],
         password: ENV['AWS_SES_PASSWORD'],
         port: 587,
         authentication: :login,
         enable_starttls_auto: true,
         domain: '<partner>.com'
      }
      # Ignore bad email addresses and do not raise email delivery errors.
      # Set this to true and configure the email server for immediate delivery to raise delivery errors.
      config.action_mailer.raise_delivery_errors = false
  ```
  7. Optional: Add a staging intercepter for an extra layer of safety
  ```ruby
    # app/mailers/staging_mailer_intercepter.rb
    # frozen_string_literal: true

   class StagingMailerInterceptor
      def self.delivering_email(message)
         whitelisted_emails = ENV['WHITELISTED_EMAILS'].split(',').map(&:strip)
         message.to = message.to & whitelisted_emails
         message.subject = "STAGING - #{message.subject}"
         message.perform_deliveries = false if message.to.blank?
      end
   end

   # config/environemnts/production.rb
   require Rails.root.join('app/mailers/staging_mailer_interceptor')
  ```
6. Create staging S3 bucket
   1. Navigate to S3 and click "Create bucket"
   2. Name the bucket <partner>-staging and use default settings
   3. Navigate to IAM > Policies and create a new policy
      a. Select the JSON view in the Policy Editor header
      b. For a Rails app using active storage, this is a good setup that fits active storage documentation:
      ```json
      {
         "Version": "2012-10-17",
         "Statement": [
            {
                  "Sid": "StagingObjectAccess",
                  "Effect": "Allow",
                  "Action": [
                     "s3:PutObject",
                     "s3:GetObject",
                     "s3:DeleteObject"
                  ],
                  "Resource": "arn:aws:s3:::<partner>-staging/*"
            },
            {
                  "Sid": "StagingListBucket",
                  "Effect": "Allow",
                  "Action": [
                     "s3:ListBucket"
                  ],
                  "Resource": "arn:aws:s3:::<moddex>-staging"
            }
         ]
      }
      ```
      c. Select the Visual view in the Policy Editor header
      d. Expand "Resources" and click the "Add ARNs" button next to bucket. If your resources tab says Object instead of bucket, open the next S3 accordion. Fill in the name of the already created staging bucket.
      e. Click next
      f. Name the bucket <Partner>StagingS3Policy
      g. Optional description: "A policy to give all the access required by Rails Active Storage to interact with the staging bucket only."
      h. Click "Create Policy"
   4. Navigate to IAM > Users and create a new user
      a. Name it <Partner>-Staging-S3
      b. Choose "Attach policies directly" and attach your policy: <Partner>StagingS3Policy
   5. On your new user, create a new access key
      a. For the use case, select 'Application running outside AWS'
      b. Name the key <Parnter>-Staging-S3-Access-Key and save keys in 1Password
   6. Save both the access key and access secret as config variables on your staging server as 'AWS_ACCESS_KEY_ID' and 'AWS_ACCESS_KEY_SECRET'

   ## Production

   7. SES
      1. Follow steps 1-5 in the staging section for “Create SES Staging User” except use “Production”
   8. S3 Bucket
      1. Follow step 6 in the staging section exchanging staging for production
      2. Ensure your rails application has the `aws-sdk-s3` gem
      3. Uncomment `amazon:` section in `storage.yml` file and populate keys in .env_overrides.rb / server ENV
      4. Set `config.active_storage.service = :amazon` in `/config/environments/production.rb`
