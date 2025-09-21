const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock email sending (for testing without Gmail setup)
app.post('/api/send-alert', async (req, res) => {
  try {
    const { alertId, location, message, severity, createdAt, governmentEmail, governmentName } = req.body;

    console.log('🚨 ALERT NOTIFICATION REQUEST:');
    console.log('================================');
    console.log(`To: ${governmentEmail}`);
    console.log(`From: Health Sense Community Watch`);
    console.log(`Subject: 🚨 Health Alert - ${severity.toUpperCase()} Priority - ${location}`);
    console.log(`Alert ID: ${alertId}`);
    console.log(`Location: ${location}`);
    console.log(`Message: ${message}`);
    console.log(`Severity: ${severity.toUpperCase()}`);
    console.log(`Generated: ${new Date(createdAt).toLocaleString()}`);
    console.log('================================');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      success: true, 
      messageId: `mock-${Date.now()}`,
      message: 'Alert notification sent successfully (MOCK MODE)',
      note: 'This is a test mode. To send real emails, configure Gmail App Password.'
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

// Mock test email sending
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { to } = req.body;

    console.log('📧 TEST EMAIL REQUEST:');
    console.log('======================');
    console.log(`To: ${to}`);
    console.log(`From: Health Sense Community Watch`);
    console.log(`Subject: Test Email - Health Sense Community Watch`);
    console.log(`Message: This is a test email from the Health Sense Community Watch system.`);
    console.log(`Sent at: ${new Date().toLocaleString()}`);
    console.log('======================');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      success: true, 
      messageId: `test-${Date.now()}`,
      message: 'Test email sent successfully (MOCK MODE)',
      note: 'This is a test mode. To send real emails, configure Gmail App Password.'
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
    message: 'Email API is running in TEST MODE',
    timestamp: new Date().toISOString(),
    note: 'Configure Gmail App Password for real email sending'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Email API server running on port ${PORT}`);
  console.log(`📧 Running in TEST MODE - emails will be logged to console`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 To enable real Gmail sending, configure App Password in .env file`);
});
