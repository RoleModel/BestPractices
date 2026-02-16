# Forward partner emails to Slack bk channel with it-support email

1. Go to slack bk channel settings and click integrations tab. Add email integration and copy email
2. Log into IT-Support Gmail
3. Click the gear in top right and "See All Settings"
4. Add a new forwarding address and go through the verification process
5. Add a new filter within settings
   a. Add it-support+yourpartner@rolemodelsoftware.com as a To: filter
   b. Click create filter button
   c. Choose the bk channel forwarding address from the dropdown. If its not there, refresh Gmail
   d. Select "Skip inbox" and "Forward to..." options
8. Create another filter:
   a. From: "bot@notifications.heroku.com OR support@papertrailapp.com"
   b. Click create filter
   c. Matches (has the words) "my-partner-name"
   d. Select "Skip inbox" and "Forward to..." options

Done!
