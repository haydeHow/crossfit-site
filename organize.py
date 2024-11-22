import psycopg2
import configparser

from psycopg2 import sql
from datetime import datetime

class WorkoutDB:
    def __init__(self):
        config = configparser.ConfigParser()
        config.read('secrets.ini')

        self.host= config['WorkoutDB']['host']
        self.port = config['WorkoutDB']['port']
        self.user = config['WorkoutDB']['user']
        self.password = config['WorkoutDB']['password']
        self.dbname = config['WorkoutDB']['dbname']

        try: 
            self.conn = psycopg2.connect(host=self.host, port=self.port, user=self.user, password=self.password, dbname=self.dbname)
            self.conn.autocommit = True
            self.cursor = self.conn.cursor()
            print(f"Connected to {self.dbname} successfully!")
        except Exception as e:
            print(f"Error: {e}")

    def insert_workout(self, warmup_description, warmup_movements,
                       strength_description, strength_movements,
                       wod_description, wod_movements,
                       cooldown_description, cooldown_movements):
        insert_query = "INSERT INTO workouts (date_api, date, warmup_description, warmup_movements, strength_description, strength_movements, wod_description, wod_movements, cooldown_description, cooldown_movements) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        date_api = datetime.now().strftime("%m/%d/%y")
        date = datetime.now().strftime("%B %d, %Y")
        data = (date_api, date, warmup_description, warmup_movements, strength_description, strength_movements, wod_description, wod_movements, cooldown_description, cooldown_movements)
        try:
            self.cursor.execute(insert_query, data)
            self.conn.commit()
            self.cursor.close()
            self.conn.close()
            print("Data inserted correctly")
        except Exception as e:
            print(f"Error: {e}")


    def create_table(self): 
        create_table_query = '''
        CREATE TABLE IF NOT EXISTS workouts (
            id SERIAL PRIMARY KEY,
            date_api VARCHAR(20) NOT NULL,
            date VARCHAR(40) NOT NULL,

            warmup_description VARCHAR(100) NOT NULL,
            warmup_movements VARCHAR(50)[],

            strength_description VARCHAR(100) NOT NULL,
            strength_movements VARCHAR(50)[],

            wod_description VARCHAR(100) NOT NULL,
            wod_movements VARCHAR(50)[],

            cooldown_description VARCHAR(100) NOT NULL,
            cooldown_movements VARCHAR(50)[], 

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        '''
        try: 
            self.cursor.execute(create_table_query)
            self.conn.commit()  
            print("Table 'workouts' created successfully in the new database!")
        except Exception as e: 
            print(f"Exception: {e}")


    def delete_table(self): 
        try:
            self.cursor.execute("DROP TABLE IF EXISTS workouts;")
            self.conn.commit()  # Commit the transaction
            print("Table 'workouts' deleted successfully!")
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__": 
    workout_db = WorkoutDB()
    workout_db.delete_table()
    workout_db.create_table()

    warmup_movements = ["a", "b", 'c']
    strength_movements = ['d', 'e', 'f']
    wod_movements = ['h', 'i','j']
    cooldown_movements = ['k','l','m']

    workout_db.insert_workout(
        "Warm-up description goes here",
        warmup_movements,
        "Strength description goes here",
        strength_movements,
        "WOD description goes here",
        wod_movements,
        "Cooldown description goes here",
        cooldown_movements
    )

