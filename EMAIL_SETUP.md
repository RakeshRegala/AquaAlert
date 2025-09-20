# Email Notification Setup Guide

This guide will help you configure Gmail email notifications for the Health Sense Community Watch system.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. Access to your project's environment variables

## Step 1: Generate Gmail App Password

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **Generate** and select **Mail** as the app
5. Copy the 16-character password (you'll need this for `VITE_GMAIL_APP_PASSWORD`)

## Step 2: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Gmail Configuration for Email Notifications
VITE_GMAIL_USER=your-email@gmail.com
VITE_GMAIL_APP_PASSWORD=your-16-character-app-password
VITE_GOVERNMENT_EMAIL=government@example.com
VITE_GOVERNMENT_NAME=Government Authority
```

Replace the values with your actual information:

- `VITE_GMAIL_USER`: Your Gmail email address
- `VITE_GMAIL_APP_PASSWORD`: The 16-character app password from Step 1
- `VITE_GOVERNMENT_EMAIL`: The email address where alerts should be sent
- `VITE_GOVERNMENT_NAME`: The name to display in email notifications

## Step 3: Test the Configuration

1. Start your development server: `npm run dev`
2. Log in as a government authority user
3. Go to the Government Dashboard
4. Click **Settings** in the Email Notifications section
5. Enter a test email address and click **Send Test**
6. Check the test email to verify the configuration works

## How It Works

- When new alerts are created in the system, the government dashboard will automatically detect them
- Email notifications are sent to the configured government email address
- Each email includes:
  - Alert severity level (High/Medium/Low)
  - Location of the alert
  - Detailed alert message
  - Alert ID and timestamp
  - Direct link to the dashboard

## Troubleshooting

### Common Issues

1. **"Email service not configured" error**
   - Check that all environment variables are set correctly
   - Restart your development server after adding environment variables

2. **"Authentication failed" error**
   - Verify your Gmail app password is correct
   - Ensure 2-Factor Authentication is enabled on your Gmail account
   - Make sure you're using the app password, not your regular Gmail password

3. **Emails not being sent**
   - Check the browser console for error messages
   - Verify the recipient email address is valid
   - Test with a simple email address first

### Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of your regular Gmail password
- Consider using a dedicated Gmail account for the application
- Regularly rotate your app passwords

## Email Template

The system sends beautifully formatted HTML emails with:
- Color-coded severity indicators
- Professional layout with your organization branding
- Clear call-to-action buttons
- Responsive design for mobile devices

## Support

If you encounter issues with email configuration, check:
1. Browser console for error messages
2. Network tab for failed requests
3. Gmail account security settings
4. Environment variable configuration
