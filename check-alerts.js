// Script to check if alerts exist in the database
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

async function checkAlerts() {
  console.log('🔍 Checking alerts in database...');
  
  try {
    // Get all alerts
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching alerts:', error);
      return;
    }

    console.log(`📊 Found ${alerts.length} alerts:`);
    
    if (alerts.length > 0) {
      alerts.forEach((alert, index) => {
        console.log(`\n${index + 1}. Alert ID: ${alert.id}`);
        console.log(`   Location: ${alert.location}`);
        console.log(`   Message: ${alert.alert_message}`);
        console.log(`   Severity: ${alert.severity}`);
        console.log(`   Created: ${alert.created_at}`);
      });
    } else {
      console.log('ℹ️ No alerts found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the function
checkAlerts();
