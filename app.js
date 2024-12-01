

const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require("path");
const cors = require('cors');
const morgan = require('morgan'); 
const fs = require('fs');


require('dotenv').config();

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';
const logStorage = [];
const users = [{ username: 'admin', password: 'password123' }];
// Configure the database pool
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});


// Custom stream to write logs to memory
const logStream = {
  write: (message) => {
    logStorage.push(message.trim());
  },
};

let json_token = null;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // Logs concise colored output (good for development)



// Middleware to parse JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Function to generate a JWT
function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// Middleware to authenticate and verify the token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer <token>
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user; // Attach user payload to the request
        next();
    });
}

const checkCustomHeader = (req, res, next) => {
    const requiredHeader = req.headers['password']; // Replace 'x-custom-header' with your desired header key

    if (!requiredHeader || requiredHeader !== `${json_token}`) {
        return res.status(403).json({ message: 'Forbidden: Invalid or missing header' });
    }

    next(); // Continue to the next middleware or route handler
};

const authenticate_log = (req, res, next) => {
    const token = req.headers['x-api-key'];
    if (token === '1234') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }
  };



// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check user credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

    // Generate a token with the user's information
    const token = generateToken({ username: user.username });
    res.json({ token });
});

// Example route protected by the header check
app.get('/data', checkCustomHeader, async (req, res) => {
    try {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedDate = `${month}/${day}/${year}`;
        // console.log(formattedDate);
        const result = await pool.query(`
            SELECT * 
            FROM workouts
            WHERE date_api = $1
            `, [formattedDate]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});


// Client function to test the login endpoint
app.get('/proxy-post', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password123' })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        json_token = await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }

    let data = null;
    try {
        const response = await fetch('http://localhost:3000/data', {
            method: 'GET',
            headers: { 'password': `${json_token}`},
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        res.send(data);
    } catch (error) {
        console.error('Error:', error.message);
    }

});

app.get('/logs', authenticate_log, (req, res) => {
    res.json(logStorage);
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
