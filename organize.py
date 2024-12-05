import psycopg2
import configparser

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
        except psycopg2.Error as e:
            print(e)


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
            print("Data inserted correctly")
        except psycopg2.Error as e:
            print(e)



    def create_workout_table(self): 
        create_table_query = '''
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
        '''
        try: 
            self.cursor.execute(create_table_query)
            self.conn.commit()  
            print("Table 'workouts' created successfully!")
        except psycopg2.Error as e:
            print(e)



    def delete_workouts_table(self): 
        try:
            self.cursor.execute("DROP TABLE IF EXISTS workouts;")
            self.conn.commit()  
            print("Table 'workouts' deleted successfully!")
        except psycopg2.Error as e:
            print(e)

    def print_workouts(self): 
        try: 
            self.cursor.execute("SELECT * FROM workouts;")
            rows = self.cursor.fetchall()
            for row in rows: 
                print(row)
        except psycopg2.Error as e:
            print(e)






if __name__ == "__main__": 
    workout_db = WorkoutDB()
    workout_db.delete_workouts_table()
    workout_db.create_workout_table()


    warmup_movements = ["400m Run", "10 Air Squats", '10 Push-Ups', '10 PVC Pass-Throughts', '10 Good Mornings (lightweight or bodyweight)']
    strength_movements = ['Warm up to a challenging, but manageable weight (70 to 80 percent of 1RM)', 'Rest 2-3 minutes between sets', 'Focus on proper form: netural spine, strong lockout, and controlled descent']
    wod_movements = ['15 Thrusters (95/65) lb', '12 Pull-Ups (or scaled with banded pull-ups or ring rows)','9 Deadlifts', '6 Burpee Box Jumps (24/20 in. box)', '400m Run']
    cooldown_movements = ['2 Minutes Child\'s Pose','2 Minutes Pigeon Pose (each side)','Counch Stretch (30 seconds per leg)', 'Foam rolling for hamstrings, glutes, and back']

    workout_db.insert_workout(
        "2 Rounds:",
        warmup_movements,
        "5x5 Deadlift",
        strength_movements,
        "For Time (20-25 Minutes)",
        wod_movements,
        "10 Minutes",
        cooldown_movements
    )


