import sqlite3
import json
from datetime import datetime

class WorkoutDB:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()

    def insert_workout(self, date, warmup_description, warmup_movements,
                       strength_description, strength_movements,
                       wod_description, wod_movements,
                       cooldown_description, cooldown_movements):
        # Convert the array to a JSON string
        warmup_movements_json = json.dumps(warmup_movements)
        strength_movements_json = json.dumps(strength_movements)
        wod_movements_json = json.dumps(wod_movements)
        cooldown_movements_json = json.dumps(cooldown_movements)

        # Insert a workout record into the table
        self.cursor.execute('''
        INSERT INTO workout (date, warmup_description, warmup_movements, 
                             strength_description, strength_movements, 
                             wod_description, wod_movements, 
                             cooldown_description, cooldown_movements)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (date, warmup_description, warmup_movements_json, 
              strength_description, strength_movements_json, 
              wod_description, wod_movements_json, 
              cooldown_description, cooldown_movements_json))
        self.conn.commit()

    def close_connection(self):
        # Close the connection to the database
        self.conn.close()

# Example usage
if __name__ == "__main__":
    # Path to your existing SQLite database
    db_path = '/Users/hayde/Desktop/example.db'

    # Create an instance of the WorkoutDB class
    workout_db = WorkoutDB(db_path)

    # Example data to insert
    date = datetime.now().strftime("%m/%d/%y")  # Current date in YY/MM/DD format
    warmup_movements = [""]
    strength_movements = [""]
    wod_movements = [""]
    cooldown_movements = [""]

    # Insert the data into the existing workout table
    workout_db.insert_workout(
        date,
        "Warm-up description goes here",
        warmup_movements,
        "Strength description goes here",
        strength_movements,
        "WOD description goes here",
        wod_movements,
        "Cooldown description goes here",
        cooldown_movements
    )

    # Close the connection
    workout_db.close_connection()

    print("Data added to the existing database successfully.")
