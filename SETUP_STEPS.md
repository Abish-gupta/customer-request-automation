# Setup Steps

This guide walks you through setting up the Customer Request Automation System using Gmail forwarding, n8n, Google Sheets, Slack, and GitHub Pages.

## Prerequisites

- Gmail account
- Google account (for Sheets access)
- Slack workspace
- n8n account (free tier available)
- GitHub account

## Step 1: Google Sheets Setup

### 1.1 Create the Orders Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Customer Orders"
3. Set up the following columns in row 1:
   - A: Timestamp
   - B: Customer Name
   - C: Phone Number
   - D: Order Details
   - E: Priority
   - F: Status
   - G: Assigned To
   - H: Notes

### 1.2 Publish the Sheet
1. Go to File → Share → Publish to web
2. Choose "Entire document" and "Comma-separated values (.csv)"
3. Click "Publish"
4. Copy the CSV URL (you'll need this for the webapp)
5. Note the Sheet ID from the URL (format: `1ABC...XYZ`)

### 1.3 Set up Service Account (for n8n)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Go to Credentials → Create Credentials → Service Account
5. Download the JSON key file
6. Share your Google Sheet with the service account email

## Step 2: Gmail Forwarding Setup

### 2.1 Configure Gmail Filters
1. Open Gmail
2. Go to Settings → Filters and Blocked Addresses
3. Click "Create a new filter"
4. Set criteria:
   - From: your WhatsApp number or specific sender
   - Subject contains: "Fwd:" (for forwarded messages)
5. Click "Create filter"
6. Choose "Forward to" and enter your automation email
7. Save the filter

### 2.2 Test Forwarding
1. Forward a test WhatsApp message to your Gmail
2. Verify it appears in your inbox
3. Check that the filter triggers correctly

## Step 3: n8n Workflow Setup

### 3.1 Install n8n
1. Sign up at [n8n.io](https://n8n.io) or self-host
2. Create a new workflow
3. Import the workflow from `n8n/flows.json`

### 3.2 Configure Workflow Nodes

#### Gmail Trigger Node
1. Add Gmail trigger node
2. Authenticate with your Gmail account
3. Set polling interval to 1 minute
4. Configure to watch for new emails

#### Email Parser Node
1. Add "Extract Email Content" node
2. Configure to extract:
   - Subject
   - Body text
   - Sender information
   - Timestamp

#### AI Text Processing Node
1. Add OpenAI or similar AI node
2. Configure prompt to extract:
   - Customer name
   - Phone number
   - Order details
   - Priority level
3. Set up API key

#### Google Sheets Append Node
1. Add Google Sheets node
2. Authenticate with service account
3. Set Sheet ID: `YOUR_SHEET_ID`
4. Configure to append rows with extracted data

#### Slack Webhook Node
1. Add Slack webhook node
2. Set webhook URL: `SLACK_WEBHOOK_URL_HERE`
3. Configure message format for notifications

### 3.3 Test the Workflow
1. Activate the workflow
2. Send a test forwarded message
3. Verify data appears in Google Sheets
4. Check Slack for notifications

## Step 4: Slack Integration

### 4.1 Create Slack App
1. Go to [api.slack.com](https://api.slack.com)
2. Click "Create New App" → "From scratch"
3. Name your app "Customer Request Bot"
4. Select your workspace

### 4.2 Set up Webhook
1. Go to "Incoming Webhooks"
2. Toggle "Activate Incoming Webhooks" to On
3. Click "Add New Webhook to Workspace"
4. Choose the channel for notifications
5. Copy the webhook URL

### 4.3 Configure Notifications
1. Set up channel: #customer-orders
2. Configure bot permissions
3. Test webhook with sample data

## Step 5: GitHub Pages Deployment

### 5.1 Prepare Repository
1. Create new GitHub repository
2. Upload all project files
3. Update `webapp/app.js` with your Google Sheets CSV URL

### 5.2 Deploy to GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### 5.3 Configure Custom Domain (Optional)
1. Add custom domain in Pages settings
2. Update DNS records
3. Enable HTTPS

## Step 6: Testing and Validation

### 6.1 End-to-End Test
1. Forward a WhatsApp message to Gmail
2. Verify n8n processes the message
3. Check Google Sheets for new entry
4. Confirm Slack notification received
5. View data in web dashboard

### 6.2 Performance Testing
1. Send multiple test messages
2. Verify processing speed
3. Check for any errors in n8n logs
4. Monitor Google Sheets API limits

## Step 7: Production Considerations

### 7.1 Security
- Use environment variables for API keys
- Implement proper authentication
- Set up rate limiting
- Enable audit logging

### 7.2 Monitoring
- Set up error alerts
- Monitor API usage
- Track processing times
- Implement health checks

### 7.3 Scaling
- Consider queue management
- Implement retry logic
- Set up load balancing
- Plan for high volume

## Troubleshooting

### Common Issues

#### Gmail Not Triggering
- Check filter configuration
- Verify forwarding is enabled
- Test with manual email

#### n8n Workflow Fails
- Check node configurations
- Verify API credentials
- Review execution logs
- Test individual nodes

#### Google Sheets Not Updating
- Verify service account permissions
- Check Sheet ID format
- Confirm API is enabled
- Review quota limits

#### Slack Notifications Missing
- Verify webhook URL
- Check channel permissions
- Test webhook manually
- Review message format

### Getting Help
- Check n8n documentation
- Review Google Sheets API docs
- Consult Slack API guides
- Check GitHub Pages troubleshooting

## Next Steps

1. **Customize**: Adapt the workflow for your specific needs
2. **Enhance**: Add more sophisticated parsing logic
3. **Scale**: Implement proper database and authentication
4. **Monitor**: Set up comprehensive logging and alerting
5. **Optimize**: Fine-tune performance and reliability
