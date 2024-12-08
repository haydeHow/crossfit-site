const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.rfwfgsjhvnpniknvhzng',
  host: 'aws-0-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: 'xNj2tXnSOA6fnTi8',
  port: 6543,
});

// Function to insert a user
const insertUser = async (username, email) => {
  const query = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
  const values = [username, email];
  
  try {
    const res = await pool.query(query, values);
    // console.log('User inserted:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting user:', err.stack);
  }
};

// Function to fetch all users
const fetchAllUsers = async () => {
  try {
    const res = await pool.query('SELECT * FROM users');
    console.log(res.rows);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
  }
};

const deleteUser = async (id) => {
      // Validate that the ID is numeric
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID.' });
    }

    try {
        // Execute the DELETE query
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        // Respond with success
        // console.log(`ID: ${id} deleted.\n\n\n`)
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Close the pool gracefully on process exit
const shutdown = async () => {
  try {
    await pool.end();
    // console.log('Database pool closed');
  } catch (err) {
    console.error('Error closing pool:', err.stack);
  }
};


// Example usage
(async () => {
  try {
    await insertUser('aabd', '@xample.com'); // Insert a new user
    // await deleteUser(9);
    await fetchAllUsers(); // Fetch all users
  } finally {
    await shutdown(); // Close the pool at the end of execution
  }
})();
