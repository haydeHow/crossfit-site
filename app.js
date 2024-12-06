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

    try {
        const response = await fetch('http://localhost:3000/secure-data', {
            headers: {
                'x-api-key': '12345', // Replace with your API key
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        output.textContent = error.message;
    }
});

// Protected route
app.get('/secure-data', authenticateApiKey, (req, res) => {
    res.json({
        message: 'Access granted to secure data',
        data: {
            example: 'This is sensitive information',
        },
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
