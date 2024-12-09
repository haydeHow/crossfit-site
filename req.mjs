import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
const supabaseUrl = 'https://rfwfgsjhvnpniknvhzng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd2Znc2podm5wbmlrbnZoem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MjU3MzEsImV4cCI6MjA0OTAwMTczMX0.ga4eAXCvELr1SBAVI2siU-K1aXXdr6iw3VswxOjEsDE';
const supabase = createClient(supabaseUrl, supabaseKey);

const fetchUsers = async () => {
  // Fetch all users
  const today = new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from('workouts') // Table name
    .select('*')      // Select all columns
    .eq('date_api', today); // Match date column to today's date


  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log(data);

};

fetchUsers();
