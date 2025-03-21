const { createClient } = require('@supabase/supabase-js');

class Database {
    constructor() {
        const supabaseUrl = '';
        const supabaseKey = '';
        this.supabase = createClient(supabaseUrl, supabaseKey);

        const database_start =
            `
            CREATE TABLE IF NOT EXISTS workouts (
                id SERIAL PRIMARY KEY,
                date_api VARCHAR(20) NOT NULL,
                date VARCHAR(40) NOT NULL,

                warmup_description VARCHAR(100) NOT NULL,
                warmup_movements TEXT[],

                strength_description VARCHAR(100) NOT NULL,
                strength_movements TEXT[],

                wod_description VARCHAR(100) NOT NULL,
                wod_movements TEXT[],

                cooldown_description VARCHAR(100) NOT NULL,
                cooldown_movements TEXT[], 

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `;
    }


    // Delete the workouts database table
    async deleteWorkoutsTable() {
        try {
            const { error } = await this.supabase
                .from('workouts')
                .delete()
                .neq('id', -1); // Deletes all rows, but keeps the table structure

            if (error) {
                console.error('Error clearing workouts table:', error.message);
            } else {
                console.log('All rows in workouts deleted successfully!');
            }
        } catch (err) {
            console.error('Unexpected error:', err.message);
        }
    }




    // Insert a user
    async insertWorkout(warmup_description, warmup_movements, strength_description, strength_movements, wod_description, wod_movements, cooldown_description, cooldown_movements) {
        const date_api = new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
        try {
            // Insert data into the "workouts" table
            const { data, error } = await this.supabase
                .from('workouts')
                .insert([
                    {
                        date_api,
                        date,
                        warmup_description,
                        warmup_movements,
                        strength_description,
                        strength_movements,
                        wod_description,
                        wod_movements,
                        cooldown_description,
                        cooldown_movements
                    }
                ])
                .select('*'); // Fetch the inserted row

            if (error) {
                console.error('Error inserting workout:', error.message);
                return null;
            }
            console.log('Workout inserted successfully!');
            return data[0];
        } catch (err) {
            console.error('Unexpected error inserting workout:', err.message);
        }
    }

    // Fetch all users
    async fetchAllWorkouts() {
        try {
            const { data, error } = await this.supabase
                .from('workouts')
                .select('*');
            if (error) {
                console.error('Error fetching workouts:', error.message);
                return null;
            }
            console.log(data);
            return data; // Return the array of workouts
        } catch (err) {
            console.error('Unexpected error fetching workouts:', err.message);
        }
    }



    // Delete a specific workout by ID
    async deleteWorkout(id) {
        if (isNaN(id)) {
            throw new Error('Invalid workout ID.');
        }
        try {
            // Use Supabase to delete a workout by ID
            const { data, error } = await this.supabase
                .from('workouts')
                .delete()
                .eq('id', id) // Match the specific ID

            if (error) {
                console.error('Error deleting workout:', error.message);
                return null;
            }

            if (data.length === 0) {
                console.log(`No workout found with ID ${id}.`);
                return null;
            }

            console.log(`Deleted workout ${id} successfully!`);
            return data[0]; // Return the deleted row
        } catch (err) {
            console.error('Unexpected error deleting workout:', err.message);
        }
    }


}



// main
(async () => {
    const db = new Database();
    await db.deleteWorkoutsTable();


    const warmup_description = "Dynamic warmup";
    const warmup_movements = ["Jumping jacks", "High knees"];
    const strength_description = "Strength training";
    const strength_movements = ["Bench press", "Deadlift"];
    const wod_description = "Workout of the Day";
    const wod_movements = ["Burpees", "Pull-ups"];
    const cooldown_description = "Cooldown";
    const cooldown_movements = ["Stretching", "Foam rolling"];

    await db.insertWorkout(
        warmup_description,
        warmup_movements,
        strength_description,
        strength_movements,
        wod_description,
        wod_movements,
        cooldown_description,
        cooldown_movements
    );


    // await db.deleteWorkout(16);
    await db.fetchAllWorkouts();
    // await db.deleteWorkoutsTable();

})();
