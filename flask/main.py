from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)

# Database connection details
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "hayde"
DB_USER = "hayde"
DB_PASSWORD = "jfjf1234$$$***"

# Function to create a database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

# Route to fetch data from the database
@app.route('/data', methods=['GET'])
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workouts;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convert the result to a list of dictionaries
    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "date": row[1],
            "warmup_description": row[2], 
            "warmup_movements": row[3], 
            "strength_description": row[4], 
            "strength_movements": row[5], 
            "wod_description": row[6], 
            "wod_movements": row[7], 
            "cooldown_description": row[8], 
            "cooldown_movements": row[9]
        })

    return jsonify(data)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
