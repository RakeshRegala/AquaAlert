// Simple test script to verify Gmail email sending
const nodemailer = require('nodemailer');

// Gmail configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rakeshregala3@gmail.com',
    pass: 'pzje dimu qdwo gkjw'
  }
});

// Test email
const mailOptions = {
  from: '"Health Sense Community Watch" <rakeshregala3@gmail.com>',
  to: 'rakeshregala3@gmail.com',
  subject: '🚨 Test Email - Health Sense Community Watch',
  html: `
    <h2>Test Email</h2>
    <p>This is a test email from the Health Sense Community Watch system.</p>
    <p>If you received this email, the notification system is working correctly!</p>
    <p>Sent at: ${new Date().toLocaleString()}</p>
  `,
};

console.log('📧 Sending test email...');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Error sending email:', error);
  } else {
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your Gmail inbox: rakeshregala3@gmail.com');
  }
});
