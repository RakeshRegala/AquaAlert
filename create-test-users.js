// Script to create test users for the system
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

async function createTestUsers() {
  console.log('👥 Creating test users...');
  
  try {
    // Create test users with different roles
    const testUsers = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Test ASHA Worker',
        role: 'asha'
      },
      {
        user_id: '00000000-0000-0000-0000-000000000002',
        name: 'Test Government Official',
        role: 'government'
      },
      {
        user_id: '00000000-0000-0000-0000-000000000003',
        name: 'Test Community Member',
        role: 'community'
      }
    ];

    for (const user of testUsers) {
      console.log(`Creating ${user.role} user: ${user.name}...`);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([user])
        .select();

      if (error) {
        console.error(`❌ Error creating ${user.role} user:`, error);
      } else {
        console.log(`✅ Created ${user.role} user: ${user.name} (ID: ${data[0].user_id})`);
      }
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('Now you can:');
    console.log('1. Login as ASHA worker and create dangerous water readings');
    console.log('2. Login as Government official and view alerts');
    console.log('3. Test real-time email notifications');

  } catch (error) {
    console.error('❌ Failed to create test users:', error);
  }
}

// Run the function
createTestUsers();
