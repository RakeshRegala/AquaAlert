const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Email template generator
function generateAlertEmailHTML(data) {
  const severityColor = {
    'high': '#dc2626',
    'medium': '#d97706', 
    'low': '#2563eb'
  }[data.severity] || '#6b7280';

  const severityIcon = {
    'high': '🚨',
    'medium': '⚠️',
    'low': 'ℹ️'
  }[data.severity] || '📢';

  const formattedDate = new Date(data.createdAt).toLocaleString();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Health Alert Notification</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, ${severityColor}, ${severityColor}dd);
                color: white;
                padding: 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 24px;
            }
            .alert-card {
                border-left: 4px solid ${severityColor};
                background: #f8fafc;
                padding: 16px;
                border-radius: 0 8px 8px 0;
                margin: 16px 0;
            }
            .severity-badge {
                display: inline-block;
                background: ${severityColor};
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 8px;
            }
            .location {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .message {
                font-size: 16px;
                margin-bottom: 16px;
            }
            .footer {
                background: #f8fafc;
                padding: 16px 24px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            .dashboard-link {
                display: inline-block;
                background: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${severityIcon} Health Alert Notification</h1>
                <p>Health Sense Community Watch System</p>
            </div>
            <div class="content">
                <p>Dear ${data.governmentName},</p>
                <p>A new health alert has been generated in your jurisdiction that requires immediate attention.</p>
                
                <div class="alert-card">
                    <div class="severity-badge">${data.severity.toUpperCase()}</div>
                    <div class="location">📍 ${data.location}</div>
                    <div class="message">${data.message}</div>
                    <div style="font-size: 14px; color: #6b7280;">
                        Alert ID: ${data.alertId}<br>
                        Generated: ${formattedDate}
                    </div>
                </div>

                <p>Please log into the Health Sense Community Watch dashboard to review the full details and take appropriate action.</p>
                
                <a href="http://localhost:8080/government-dashboard" class="dashboard-link">
                    View Dashboard
                </a>
            </div>
            <div class="footer">
                <p>This is an automated notification from the Health Sense Community Watch System.</p>
                <p>Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// API endpoint to send alert notifications
app.post('/api/send-alert', async (req, res) => {
  try {
    const { alertId, location, message, severity, createdAt, governmentEmail, governmentName } = req.body;

    if (!governmentEmail || !governmentName) {
      return res.status(400).json({ error: 'Government email and name are required' });
    }

    const mailOptions = {
      from: `"Health Sense Community Watch" <${process.env.GMAIL_USER}>`,
      to: governmentEmail,
      subject: `🚨 Health Alert - ${severity.toUpperCase()} Priority - ${location}`,
      html: generateAlertEmailHTML({
        alertId,
        location,
        message,
        severity,
        createdAt,
        governmentName
      }),
      text: `
Health Alert Notification

Severity: ${severity.toUpperCase()}
Location: ${location}
Message: ${message}
Alert ID: ${alertId}
Generated: ${new Date(createdAt).toLocaleString()}

Please log into the dashboard to review and take action.
      `.trim(),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Alert email sent successfully:', result.messageId);
    
    res.json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Alert notification sent successfully'
    });

  } catch (error) {
    console.error('Failed to send alert email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email notification',
      details: error.message
    });
  }
});

// API endpoint to send test emails
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const mailOptions = {
      from: `"Health Sense Community Watch" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Test Email - Health Sense Community Watch',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Health Sense Community Watch system.</p>
        <p>If you received this email, the notification system is working correctly.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', result.messageId);
    
    res.json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('Failed to send test email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Email API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Email API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
