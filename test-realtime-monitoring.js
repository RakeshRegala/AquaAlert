// Test script to verify real-time monitoring
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

console.log('🔍 Testing real-time monitoring connection...');

// Test real-time subscription
const channel = supabase
  .channel('test_alerts_changes')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'alerts' 
    }, 
    (payload) => {
      console.log('🚨 ALERT DETECTED:', payload.new);
    }
  )
  .subscribe((status) => {
    console.log('📡 Subscription status:', status);
  });

console.log('✅ Real-time monitoring test started');
console.log('📝 Create a new alert in the ASHA dashboard to test...');
console.log('⏰ This will run for 30 seconds...');

// Keep the script running for 30 seconds
setTimeout(() => {
  console.log('⏰ Test completed');
  supabase.removeChannel(channel);
  process.exit(0);
}, 30000);
