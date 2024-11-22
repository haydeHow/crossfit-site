from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

app.secret_key = 'your_secret_key'  # Secure your session data

# In-memory "user database" (use a proper database in production)
users = {"admin": "password123"}  # Username: Password


# Database connection details
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "hayde"
DB_USER = "hayde"
DB_PASSWORD = "jfjf1234$$$***"


@app.route('/')
def home():
    return render_template('demo.html')

# Route to fetch data from the database
@app.route('/data', methods=['GET'])
def get_data():
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
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


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            session['username'] = username
            return redirect(url_for('get_data'))
        return "Invalid credentials. Please try again."
    return '''
    <form method="post">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Login">
    </form>
    '''

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))


@app.route('/private')
def private():
    if 'username' not in session:
        return redirect(url_for('data'))  # Redirect to login if not authenticated
    return "This is a private link. Only logged-in users can see this."



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
