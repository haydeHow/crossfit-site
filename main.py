from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

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
            "date_api": row[1],
            "date": row[2], 
            "warmup_description": row[3], 
            "warmup_movements": row[4], 
            "strength_description": row[5], 
            "strength_movements": row[6], 
            "wod_description": row[7], 
            "wod_movements": row[8], 
            "cooldown_description": row[9], 
            "cooldown_movements": row[10]
        })

    return jsonify(data)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
