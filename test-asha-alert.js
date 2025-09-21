// Script to test ASHA dashboard alert creation
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

async function testAshaAlert() {
  console.log('🧪 Testing ASHA dashboard alert creation...');
  
  try {
    // First, let's check if there are any ASHA users
    const { data: ashaUsers, error: userError } = await supabase
      .from('profiles')
      .select('user_id, name, role')
      .eq('role', 'asha')
      .limit(1);

    if (userError) {
      console.error('❌ Error fetching ASHA users:', userError);
      return;
    }

    if (!ashaUsers || ashaUsers.length === 0) {
      console.log('❌ No ASHA users found in database');
      return;
    }

    const ashaUser = ashaUsers[0];
    console.log('✅ Found ASHA user:', ashaUser.name, '(ID:', ashaUser.user_id + ')');

    // Now let's create a dangerous water reading that should trigger an alert
    console.log('💧 Creating dangerous water reading...');
    
    const { data: waterReading, error: waterError } = await supabase
      .from('water_readings')
      .insert({
        reporter_id: ashaUser.user_id,
        location: 'Test Location - Dangerous Water',
        ph: 5.0, // Dangerous (too acidic)
        turbidity: 8.0, // Dangerous (too high)
        contamination_level: 0.8 // Dangerous (too high)
      })
      .select();

    if (waterError) {
      console.error('❌ Error creating water reading:', waterError);
      return;
    }

    console.log('✅ Water reading created:', waterReading[0].id);

    // Now let's create the alert manually (simulating what the ASHA dashboard should do)
    console.log('🚨 Creating alert for dangerous water reading...');
    
    const alertMessage = `Dangerous water quality detected at Test Location - Dangerous Water. pH: 5.0 (unsafe). Turbidity: 8.0 (high). Contamination: 0.8 (high). `;
    
    const { data: alert, error: alertError } = await supabase
      .from('alerts')
      .insert({
        triggered_by: ashaUser.user_id,
        location: 'Test Location - Dangerous Water',
        alert_message: alertMessage,
        severity: 'high'
      })
      .select();

    if (alertError) {
      console.error('❌ Error creating alert:', alertError);
      console.error('Alert error details:', alertError.message);
    } else {
      console.log('✅ Alert created successfully!');
      console.log('📧 Alert ID:', alert[0].id);
      console.log('📬 Check your Gmail inbox: rakeshregala3@gmail.com');
      console.log('⏰ Email should arrive within 10 seconds...');
    }

  } catch (error) {
    console.error('❌ Failed to test ASHA alert:', error);
  }
}

// Run the function
testAshaAlert();
