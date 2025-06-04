import click
from flask import Flask
from flask_bcrypt import Bcrypt
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
DATABASE_URL = os.getenv('DATABASE_URL')

def get_db():
    """
    Establishes and returns a new connection to the PostgreSQL database
    using the DATABASE_URL environment variable.
    
    Returns:
        psycopg2.connection: A new database connection.
    """
    return psycopg2.connect(DATABASE_URL)

@click.group()
def cli():
    """
    Command Line Interface group for managing administrative tasks.
    """
    pass

@cli.command("create-admin")
def create_admin():
    """
    Command-line tool to create a new admin user.
    
    Prompts the user for a username and password, hashes the password, and inserts
    a new admin record into the users table. If the username already exists, an error is shown.
    """
    username = click.prompt("Enter admin username")
    password = click.prompt("Enter admin password", hide_input=True, confirmation_prompt=True)

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, password, role) VALUES (%s, %s, 'admin')",
            (username, hashed_pw),
        )
        conn.commit()
        click.echo(f"Admin user '{username}' created successfully!")
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        click.echo(f"Error: Username '{username}' already exists.")
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    cli()
