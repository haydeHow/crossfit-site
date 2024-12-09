const express = require('express');
const path = require('path');
const cors = require('cors');
const { default: axios } = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated database of API keys (use secure storage in production)
const validApiKeys = new Set(['12345', '67890']);

// Middleware to validate API key
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key']; // API key is expected in the 'x-api-key' header

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is missing' });
    }

    if (!validApiKeys.has(apiKey)) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next(); // API key is valid, proceed to the next middleware or route
}

// Route: Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Proxy to another API
app.get('/proxy', async (req, res) => {
    try {
        const apiURL = 'http://localhost:3000/secure-data'; // Replace with the full URL of your API
        const response = await axios.get(apiURL, {
            headers: {
                'x-api-key': '12345', // Replace with your API key
            },
        });

        res.send(response.data); // Send the response data to the client
    } catch (error) {
        console.error('Error fetching data from proxy:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from the proxy.' });
    }
});

// Route: Secure data with API key validation
app.get('/secure-data', authenticateApiKey, async (req, res) => {
    try {
        // Initialize Supabase client
        const supabaseUrl = 'https://rfwfgsjhvnpniknvhzng.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd2Znc2podm5wbmlrbnZoem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MjU3MzEsImV4cCI6MjA0OTAwMTczMX0.ga4eAXCvELr1SBAVI2siU-K1aXXdr6iw3VswxOjEsDE';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const today = new Date().toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        });

        // Fetch data from Supabase
        const { data, error } = await supabase
            .from('workouts') // Table name
            .select('*')      // Select all columns
            .eq('date_api', today); // Match date column to today's date

        if (error) {
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch data from Supabase.' });
        }

        res.json(data); // Send the fetched data to the client
    } catch (err) {
        console.error('Unexpected error in secure-data route:', err);
        res.status(500).json({ error: 'An unexpected error occurred while fetching secure data.' });
    }
});

// Start the server
const port = parseInt(process.env.PORT, 10) || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
