const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      user: 'postgres.rfwfgsjhvnpniknvhzng',
      host: 'aws-0-us-east-1.pooler.supabase.com',
      database: '',
      password: '',
      port: 6543,
    });
  }

  // Insert a user
  async insertUser(username, email) {
    const query = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
    const values = [username, email];
    try {
      const res = await this.pool.query(query, values);
      console.log('User inserted:', res.rows[0]);
      return res.rows[0];
    } catch (err) {
      console.error('Error inserting user:', err.stack);
    }
  }

  // Fetch all users
  async fetchAllUsers() {
    try {
      const res = await this.pool.query('SELECT * FROM users');
      console.log('Fetched users:', res.rows);
      return res.rows;
    } catch (err) {
      console.error('Error fetching users:', err.stack);
    }
  }

  // Delete all users
  async deleteAllUsers() {
    try {
      const result = await this.pool.query('DELETE FROM users RETURNING *');
      console.log('Deleted users:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  }

  // Delete a specific user by ID
  async deleteUser(id) {
    if (isNaN(id)) {
      throw new Error('Invalid user ID.');
    }
    try {
      const result = await this.pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      console.log(`Deleted user with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  // Gracefully close the pool
  async shutdown() {
    try {
      await this.pool.end();
      console.log('Database pool closed');
    } catch (err) {
      console.error('Error closing pool:', err.stack);
    }
  }
}

// Example usage
(async () => {
  const db = new Database();

  // Example operations
  await db.insertUser('john_doe', 'john@example.com');
  await db.fetchAllUsers();
  await db.deleteUser(1);
  await db.deleteAllUsers();

  // Shutdown the pool
  await db.shutdown();
})();
