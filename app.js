const express = require('express');
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



// Simulated database of API keys
const validApiKeys = new Set(['12345', '67890']); // Replace with secure storage in production

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/proxy', async (req, res) => {

    const response = await fetch('http://localhost:3000/secure-data', {
        headers: {
            'x-api-key': '12345', // Replace with your API key
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    res.send(data);
});

// Protected route
// Protected route
app.get('/secure-data', authenticateApiKey, async (req, res) => {
    try {
        const { createClient } = require('@supabase/supabase-js');

        // Initialize Supabase client
        const supabaseUrl = 'https://rfwfgsjhvnpniknvhzng.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd2Znc2podm5wbmlrbnZoem5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MjU3MzEsImV4cCI6MjA0OTAwMTczMX0.ga4eAXCvELr1SBAVI2siU-K1aXXdr6iw3VswxOjEsDE';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch all users
        const { data, error } = await supabase
            .from('users')  // Table name
            .select('*');   // Select all columns

        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Failed to fetch users.' });
        }

        // Send the fetched data as a response
        res.json(data);
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
