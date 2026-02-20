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
   1. Navigate to IAM > Policies and create a new policy
      a. Select the JSON view in the Policy Editor header
      b. Use the following policy with staging mail limiting:
      ```JSON
      {
         "Version": "2012-10-17",
         "Statement": [
            {
               "Effect": "Allow",
               "Action": "ses:*",
               "Resource": "*",
               "Condition": {
                  "ForAllValues:StringLike": {
                     "ses:Recipients": [
                        "*@<partner>.com",
                        "*@rolemodelsoftware.com"
                     ]
                  }
               }
            }
         ]
      }
      ```
      c. Name the policy `<Partner>StagingSESPolicy`
      d. Click "Create Policy"
   2. Navigate to Amazon SES
   3. Click on "SMTP Settings"
   4. Click "Create SMTP Credentials"
   5. Change name to "<PartnerName>-SES-User-Staging"
   6. Under "Existing IAM Group", select the group associated with your `<Partner>StagingSESPolicy` policy
   7. Create user and copy credentials into 1P
4. Create Identity
   1. Navigate to “Identities” in left nav
   2. Create Identity
   3. Add domain for your partner e.i.<partner>.com
   4. Accept default config and create Identity
   5. Verify the domain
      1. Will need to reach out to get access and add records that AWS gives to their domain setup. Expand “Publish DNS records” to download CSV
   6. Complete the setup steps
      1. Navigate to the "Get set up" page within SES
      2. Verify the sending domain after the records you sent your partner have been registered.
      3. Create an identity and verify email address `it-support+<partner>@rolemodelsoftware.com`
      4. Enable Virtual Deliverability Manager
      5. Request Production Access
      6. Dedicated IP Address if needed. Read up if this would be advantageous. Generally useful if sending higher volume of emails.
   7. Add the following code to the rails application
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
  1. Optional: Add a staging intercepter for an extra layer of safety
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
  1. Set environment variables:
     1. `AWS_SES_USER`
     2. `AWS_SES_PASSWORD`
     3. `SMTP_SENDER` -> `<Parnter> <noreply@<partner>.com>`
     4. `PRODUCTION_HOST` -> The url links in mail will be directing to.
  10.

1. Create staging S3 bucket
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
