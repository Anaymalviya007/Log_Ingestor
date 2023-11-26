from flask import Flask, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING, DESCENDING, TEXT
from datetime import datetime
from pymongo.server_api import ServerApi
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import secrets

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)

# MongoDB connection
uri = ""
client = MongoClient(uri)
db = client['Cluster0']
logs_collection = db['logs']

# PostgreSQL connection settings
postgres_conn = {
    'dbname': 'log',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost'
}

# Drop and create indexes for MongoDB
try:
    logs_collection.drop_index("log_text_index")
except Exception as e:
    print(f"Error dropping index: {e}")

logs_collection.create_index([
    ("message", TEXT),
    ("resourceId", ASCENDING),
    ("traceId", ASCENDING),
    ("spanId", ASCENDING),
    ("commit", ASCENDING)
], name="log_text_index") 

# Indexing for frequently used fields
logs_collection.create_index([("level", ASCENDING), ("timestamp", DESCENDING)])
logs_collection.create_index([("metadata.parentResourceId", ASCENDING)])

# Create a users table if it doesn't exist
def create_users_table():
    try:
        conn = psycopg2.connect(**postgres_conn)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(200) NOT NULL
            )
        ''')
        conn.commit()
    except psycopg2.Error as e:
        print(f"Error creating users table: {e}")
    finally:
        cursor.close()
        conn.close()

create_users_table()



# Register endpoint - user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = generate_password_hash(password)

    # Insert user into PostgreSQL
    try:
        conn = psycopg2.connect(**postgres_conn)
        cursor = conn.cursor()

        cursor.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, hashed_password))
        conn.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except psycopg2.Error as e:
        return jsonify({"error": "Error registering user"}), 500
    finally:
        cursor.close()
        conn.close()


# Login endpoint - user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        conn = psycopg2.connect(**postgres_conn)
        cursor = conn.cursor()

        cursor.execute('SELECT password FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user[0], password):
            session['username'] = username
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except psycopg2.Error as e:
        return jsonify({"error": "Error logging in"}), 500
    finally:
        cursor.close()
        conn.close()



# Ingest logs into MongoDB
@app.route('/', methods=['POST'])
def ingest_logs():
    try:
        log_data = request.get_json()

        if isinstance(log_data, list):
            # Convert timestamp to datetime object
            for log in log_data:
                log['timestamp'] = datetime.fromisoformat(log['timestamp'])

            batch_size = 1000
            total_logs = len(log_data)

            for i in range(0, total_logs, batch_size):
                # Insert log entries in batches
                batch = log_data[i:i + batch_size]
                insert_logs(batch)

            return jsonify({"message": f"{total_logs} logs scheduled for ingestion"}), 201
        else:
            return jsonify({"error": "Invalid log data format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Insert logs into MongoDB
def insert_logs(logs):
        try:
            logs_collection.insert_many(logs)
        except Exception as e:
            print(f"Error during log insertion: {e}")


# Search logs in MongoDB
@app.route('/search', methods=['GET'])
def search_logs():
    try:
        filters = {}

        if 'level' in request.args:
            filters['level'] = request.args['level']
        if 'message' in request.args:
            filters['message'] = {'$regex': request.args['message']}
        if 'resourceId' in request.args:
            filters['resourceId'] = request.args['resourceId']
        if 'traceId' in request.args:
            filters['traceId'] = request.args['traceId']
        if 'spanId' in request.args:
            filters['spanId'] = request.args['spanId']
        if 'commit' in request.args:
            filters['commit'] = request.args['commit']
        if 'parentResourceId' in request.args:
            filters['metadata.parentResourceId'] = request.args['parentResourceId']
        if 'start_date' in request.args and 'end_date' in request.args:
            filters['timestamp'] = {
                '$gte': datetime.fromisoformat(request.args['start_date']),
                '$lte': datetime.fromisoformat(request.args['end_date'])
            }

        result = logs_collection.find(filters)

        logs = []
        for log in result:
            log['_id'] = str(log['_id'])
            logs.append(log)

        return jsonify({"logs": logs}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app on port 3000
if __name__ == '__main__':
    app.run(port=3000)
