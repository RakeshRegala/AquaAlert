// Script to check what users exist in the database
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://pxnexbjbqofjacmkackh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q'
);

async function checkUsers() {
  console.log('👥 Checking users in database...');
  
  try {
    // Check all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, name, role')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('❌ No profiles found in database');
      return;
    }

    console.log(`📊 Found ${profiles.length} profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.name} (${profile.role}) - ID: ${profile.user_id}`);
    });

    // Check by role
    const roles = ['government', 'asha', 'community'];
    for (const role of roles) {
      const roleUsers = profiles.filter(p => p.role === role);
      console.log(`\n${role.toUpperCase()} users: ${roleUsers.length}`);
      roleUsers.forEach(user => {
        console.log(`  - ${user.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Failed to check users:', error);
  }
}

// Run the function
checkUsers();
