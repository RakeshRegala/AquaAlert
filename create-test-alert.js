// Script to manually create a test alert and trigger email
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

async function createTestAlert() {
  console.log('🚨 Creating test alert manually...');
  
  try {
    // Create a test alert directly
    const { data, error } = await supabase
      .from('alerts')
      .insert([
        {
          triggered_by: '00000000-0000-0000-0000-000000000000', // System user
          location: 'Test Location - Manual Alert',
          alert_message: 'This is a manually created test alert to verify real-time email notifications. If you receive this email, the system is working!',
          severity: 'high'
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error creating alert:', error);
      console.error('Error details:', error.message);
    } else {
      console.log('✅ Test alert created successfully!');
      console.log('📧 Alert ID:', data[0].id);
      console.log('📬 Check your Gmail inbox: rakeshregala3@gmail.com');
      console.log('⏰ Email should arrive within 10 seconds...');
    }
  } catch (error) {
    console.error('❌ Failed to create test alert:', error);
  }
}

// Run the function
createTestAlert();
