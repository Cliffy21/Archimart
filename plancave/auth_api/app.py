from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from config import Config

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)


def get_db():
    """
    Establishes and returns a new connection to the PostgreSQL database using the configured DATABASE_URL.
    """
    return psycopg2.connect(app.config['DATABASE_URL'])


def get_current_user():
    """
    Retrieves the current user's identity from the JWT token.

    Returns:
        tuple: User ID and role of the currently authenticated user.
    """
    identity = get_jwt_identity()
    return identity['id'], identity['role']


def register_user(data, role):
    """
    Registers a new user with the specified role (customer, designer, or admin).

    Args:
        data (dict): The request data containing 'username' and 'password'.
        role (str): Role to assign to the new user.

    Returns:
        Response: JSON response indicating success or failure of the registration process.
    """
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify(message="Username and password are required"), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, password, role) VALUES (%s, %s, %s) RETURNING id;",
            (username, hashed_pw, role)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify(message="Username already exists"), 409
    finally:
        cur.close()
        conn.close()

    return jsonify(message=f"{role.capitalize()} registered", user_id=user_id), 201


@app.route('/register/customer', methods=['POST'])
def register_customer():
    """
    Endpoint for registering a new customer.

    Returns:
        Response: JSON response from the registration process.
    """
    data = request.get_json()
    return register_user(data, role='customer')


@app.route('/register/designer', methods=['POST'])
def register_designer():
    """
    Endpoint for registering a new designer.

    Returns:
        Response: JSON response from the registration process.
    """
    data = request.get_json()
    return register_user(data, role='designer')


@app.route('/admin/create_user', methods=['POST'])
@jwt_required()
def create_user():
    """
    Endpoint for admins to create new users with any role.

    Returns:
        Response: JSON response indicating the result of the operation.
    """
    current_user_id, current_role = get_current_user()
    if current_role != 'admin':
        return jsonify(message="Admins only"), 403

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if role not in ['admin', 'designer', 'customer']:
        return jsonify(message="Invalid role"), 400

    return register_user({'username': username, 'password': password}, role=role)


@app.route('/login', methods=['POST'])
def login():
    """
    Authenticates a user and returns a JWT access token if credentials are valid.

    Returns:
        Response: JSON containing the access token or an error message.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, password, role FROM users WHERE username=%s;", (username,))
    result = cur.fetchone()
    cur.close()
    conn.close()

    if not result:
        return jsonify(message="Invalid credentials"), 401

    user_id, hashed_pw, role = result

    if bcrypt.check_password_hash(hashed_pw, password):
        token = create_access_token(identity={"id": user_id, "role": role})
        return jsonify(access_token=token)
    else:
        return jsonify(message="Invalid credentials"), 401


@app.route('/dashboard', methods=['GET'])
@jwt_required()
def protected():
    """
    Protected dashboard endpoint accessible only to authenticated users.

    Returns:
        Response: JSON message with a greeting to the user.
    """
    user_id, role = get_current_user()
    return jsonify(message=f"Welcome {role} #{user_id}!")


if __name__ == '__main__':
    app.run(debug=True)
