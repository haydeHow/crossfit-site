import { createClient } from '@supabase/supabase-js'; // Import createClient from the Supabase library

// Initialize the Supabase client
const supabase = createClient(
  'https://rfwfgsjhvnpniknvhzng.supabase.co', // Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd2Znc2podm5wbmlrbnZoem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MjU3MzEsImV4cCI6MjA0OTAwMTczMX0.ga4eAXCvELr1SBAVI2siU-K1aXXdr6iw3VswxOjEsDE' // Supabase Anon Key
);

const { data, error } = await supabase
  .from('workouts')
  .select('*');

if (error) {
  console.error('Error fetching data:', error);
} else {
  console.log('Data:', data);
}