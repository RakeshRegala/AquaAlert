// Manual script to send email for a specific alert
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

async function sendEmailForLatestAlert() {
  console.log('📧 Sending email for latest alert...');
  
  try {
    // Get the latest alert
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching alerts:', error);
      return;
    }

    if (alerts.length === 0) {
      console.log('ℹ️ No alerts found');
      return;
    }

    const alert = alerts[0];
    console.log('📋 Latest alert:', alert);

    // Send email via the API
    const response = await fetch('http://localhost:3001/api/send-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alertId: alert.id,
        location: alert.location,
        message: alert.alert_message,
        severity: alert.severity,
        createdAt: alert.created_at,
        governmentEmail: 'rakeshregala3@gmail.com',
        governmentName: 'Rakesh'
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📬 Check your Gmail inbox: rakeshregala3@gmail.com');
    } else {
      console.error('❌ Failed to send email:', result.error);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the function
sendEmailForLatestAlert();
