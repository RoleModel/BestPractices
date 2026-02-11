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
4. Create SES Production User
   1. Follow steps 1-5 for “Create Ses Staging User” except use “Production”
5. Create Identity
   1. Navigate to “Identities” in left nav
   2. Create Identity
   3. Add domain for your partner e.i.<partner>.com
   4. Verify the domain
      1. Will need to reach out to get access and add records that AWS gives to their domain setup. Expand “Publish DNS records” to download CSV
6. Create staging S3 bucket
   1. Navigate to S3 and click "Create bucket"
   2. Name the bucket <partner>-staging and use default settings
   3. Navigate to IAM > Policies and create a new policy
      a. For a Rails app using active storage, this is a good setup that fits active storage documentation:
      ```
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
      b. Expand "Resources" and click the "Add ARNs" button next to bucket. Fill in the name of the already created staging bucket.
      c. Click next
      d. Name the bucket <Partner>StagingS3Policy
      e. Optional description: "A policy to give all the access required by Rails Active Storage to interact with the staging bucket only."
      f. Click "Create Policy"
   3. Navigate to IAM > Users and create a new user called <Partner>-Staging-S3
   4. Choose "Attach policies directly" and attach your policy: <Partner>StagingS3Policy
   5. Name the key <Parnter>-Staging-S3-Access-Key and save keys in 1Password
   6. Ensure your rails application has the `aws-sdk-s3` gem
   7. Uncomment `amazon:` section in `storage.yml` file and populate keys in .env_overrides.rb / server ENV
   8. Set `config.active_storage.service = :amazon` in `/config/environments/production.rb`