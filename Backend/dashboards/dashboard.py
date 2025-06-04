from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import psycopg2
import psycopg2.extras
from datetime import datetime

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')


def get_current_user():
    identity = get_jwt_identity()
    return identity.get('id'), identity.get('role')


def get_db_connection():
    return psycopg2.connect(current_app.config['DATABASE_URL'])


# ------------------------------
# Admin Dashboard
# ------------------------------
@dashboard_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_dashboard():
    user_id, role = get_current_user()
    if role != 'admin':
        return jsonify(message="Access denied: Admins only"), 403

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT COUNT(*) FROM users;")
        user_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM users WHERE role = 'designer';")
        designer_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM plans;")
        plan_count = cur.fetchone()[0]

        cur.execute("SELECT COALESCE(SUM(price * sales_count), 0) FROM plans;")
        total_sales = cur.fetchone()[0]

        return jsonify({
            "message": f"Welcome Admin #{user_id}",
            "stats": {
                "user_count": user_count,
                "designer_count": designer_count,
                "plan_count": plan_count,
                "total_sales": f"${total_sales:,.2f}"
            }
        })
    finally:
        cur.close()
        conn.close()


# ------------------------------
# Architect Dashboard
# ------------------------------
@dashboard_bp.route('/architect', methods=['GET'])
@jwt_required()
def architect_dashboard():
    user_id, role = get_current_user()
    if role != 'designer':
        return jsonify(message="Access denied: Designers only"), 403

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT COUNT(*) FROM plans WHERE designer_id = %s;", (user_id,))
        plan_count = cur.fetchone()[0]

        cur.execute("SELECT COALESCE(SUM(price * sales_count), 0) FROM plans WHERE designer_id = %s;", (user_id,))
        total_earnings = cur.fetchone()[0]

        cur.execute("""
            SELECT name, status, price, sales_count 
            FROM plans 
            WHERE designer_id = %s 
            ORDER BY id DESC 
            LIMIT 5;
        """, (user_id,))
        recent_plans = [dict(row) for row in cur.fetchall()]

        return jsonify({
            "message": f"Welcome Architect #{user_id}",
            "dashboard": {
                "total_plans_uploaded": plan_count,
                "total_earnings": f"${total_earnings:,.2f}",
                "recent_plans": recent_plans
            }
        })
    finally:
        cur.close()
        conn.close()


# ------------------------------
# Customer Dashboard
# ------------------------------
@dashboard_bp.route('/customer', methods=['GET'])
@jwt_required()
def customer_dashboard():
    user_id, role = get_current_user()
    if role != 'customer':
        return jsonify(message="Access denied: Customers only"), 403

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("""
            SELECT p.name, p.price, p.id 
            FROM plans p
            JOIN purchases pu ON pu.plan_id = p.id
            WHERE pu.customer_id = %s;
        """, (user_id,))
        purchased = [dict(row) for row in cur.fetchall()]

        cur.execute("""
            SELECT name, price 
            FROM plans 
            ORDER BY sales_count DESC 
            LIMIT 3;
        """)
        recommended = [dict(row) for row in cur.fetchall()]

        return jsonify({
            "message": f"Welcome Customer #{user_id}",
            "dashboard": {
                "purchased_plans": purchased,
                "recommended": recommended
            }
        })
    finally:
        cur.close()
        conn.close()


# ------------------------------
# Generic Profile Endpoint
# ------------------------------
@dashboard_bp.route('/me', methods=['GET'])
@jwt_required()
def my_profile():
    user_id, role = get_current_user()

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT username, role, created_at FROM users WHERE id = %s;", (user_id,))
        user = cur.fetchone()
        if not user:
            return jsonify(message="User not found"), 404

        return jsonify({
            "user_id": user_id,
            "username": user['username'],
            "role": user['role'],
            "created_at": user['created_at'].isoformat()
        })
    finally:
        cur.close()
        conn.close()
