const { Pool } = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            user: 'postgres.rfwfgsjhvnpniknvhzng',
            host: 'aws-0-us-east-1.pooler.supabase.com',
            database: 'postgres',
            password: 'xNj2tXnSOA6fnTi8',
            port: 6543,
        });
    }

    // Delete all workouts
    async creatWorkoutsDatabase() {
        try {
            create_table_query = `
                   CREATE TABLE IF NOT EXISTS workouts (
            id SERIAL PRIMARY KEY,
            date_api VARCHAR(20) NOT NULL,
            date VARCHAR(40) NOT NULL,

            warmup_description VARCHAR(100) NOT NULL,
            warmup_movements VARCHAR(300)[],

            strength_description VARCHAR(100) NOT NULL,
            strength_movements VARCHAR(300)[],

            wod_description VARCHAR(100) NOT NULL,
            wod_movements VARCHAR(300)[],

            cooldown_description VARCHAR(100) NOT NULL,
            cooldown_movements VARCHAR(300)[], 

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
            const result = await this.pool.query(`${create_table_query}`);
            console.log(`Created workouts table sucessfully!`)
            return result.rows;
        } catch (error) {
            console.error('Error creating workouts table:', error);
        }
    }

    // Insert a user
    async insertWorkout(warmup_description, warmup_movements, strength_description, strength_movements, wod_descriptions, wod_movements, cooldown_description, cooldown_movements) {
        const date_api = new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });

        const query = 'INSERT INTO workouts (date_api, date, warmup_description, warmup_movements, strength_description, strength_movements, wod_description, wod_movements, cooldown_description, cooldown_movements) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
        const values = [date_api, date, warmup_description, warmup_movements, strength_description, strength_movements, wod_descriptions, wod_movements, cooldown_description, cooldown_movements];
        try {
            const res = await this.pool.query(query, values);
            console.log("Workout inserted correctly!");
            return res.rows[0];
        } catch (err) {
            console.error('Error inserting user:', err.stack);
        }
    }

    // Fetch all users
    async fetchAllWorkouts() {
        try {
            const res = await this.pool.query('SELECT * FROM workouts');
            // console.log('Fetched users:', res.rows);
            return res.rows;
        } catch (err) {
            console.error('Error fetching workouts:', err.stack);
        }
    }

    // Delete all workouts
    async deleteAllWorkouts() {
        try {
            const result = await this.pool.query('DELETE FROM workouts RETURNING *');
            console.log(`Deleted all workouts sucessfully!`)
            return result.rows;
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    }

    // Delete a specific workout by ID
    async deleteWorkout(id) {
        if (isNaN(id)) {
            throw new Error('Invalid workout ID.');
        }
        try {
            const result = await this.pool.query('DELETE FROM workouts WHERE id = $1 RETURNING *', [id]);
            console.log(`Deleted workout ${id} sucessfully!`);
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



// main
(async () => {
    const db = new Database();



    var warmup_movements = ["400m Run", "10 Air Squats", '10 Push-Ups', '10 PVC Pass-Throughts', '10 Good Mornings (lightweight or bodyweight)']
    var strength_movements = ['Warm up to a challenging, but manageable weight (70 to 80 percent of 1RM)', 'Rest 2-3 minutes between sets', 'Focus on proper form: netural spine, strong lockout, and controlled descent']
    var wod_movements = ['15 Thrusters (95/65) lb', '12 Pull-Ups (or scaled with banded pull-ups or ring rows)', '9 Deadlifts', '6 Burpee Box Jumps (24/20 in. box)', '400m Run']
    var cooldown_movements = ['2 Minutes Child\'s Pose', '2 Minutes Pigeon Pose (each side)', 'Counch Stretch (30 seconds per leg)', 'Foam rolling for hamstrings, glutes, and back']


    // operations
    db.insertWorkout(
        "2 Rounds:",
        warmup_movements,
        "5x5 Deadlift",
        strength_movements,
        "For Time (20-25 Minutes)",
        wod_movements,
        "10 Minutes",
        cooldown_movements
    )

    // await db.fetchAllWorkouts();
    // await db.deleteWorkout(1);
    // await db.deleteAllWorkouts();

    // shutdown
    await db.shutdown();
})();