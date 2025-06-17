from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from google.cloud import storage
import os
import uuid
import psycopg2
import psycopg2.extras
from datetime import datetime
import json

plans_bp = Blueprint('plans', __name__, url_prefix='/plans')


def get_current_user():
    identity = get_jwt_identity()
    return identity.get('id'), identity.get('role')


def get_db():
    return psycopg2.connect(current_app.config['DATABASE_URL'])


def upload_to_gcs(blob_name, file_obj, content_type):
    client = storage.Client()
    bucket = client.bucket(current_app.config['GCS_BUCKET_NAME'])
    blob = bucket.blob(blob_name)
    blob.upload_from_file(file_obj, content_type=content_type)
    blob.make_public()
    return blob.public_url


def validate_plan_data(form):
    required_fields = ['name', 'category', 'price', 'status', 'area', 'bedrooms', 'bathrooms', 'floors']
    for field in required_fields:
        if field not in form:
            raise ValueError(f"Missing field: {field}")
    return {
        'name': form['name'],
        'category': form['category'],
        'price': float(form['price']),
        'status': form['status'],
        'area': float(form['area']),
        'bedrooms': int(form['bedrooms']),
        'bathrooms': int(form['bathrooms']),
        'floors': int(form['floors'])
    }


@plans_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_plan():
    user_id, role = get_current_user()
    if role not in ['admin', 'designer']:
        return jsonify(message="Access denied: Admins and Designers only"), 403

    try:
        plan_data = validate_plan_data(request.form)
    except ValueError as e:
        return jsonify(message=str(e)), 400

    images = request.files.getlist('images')
    if not images:
        return jsonify(message="At least one image is required."), 400

    plan_id = str(uuid.uuid4())
    image_urls = []

    for image in images:
        filename = secure_filename(image.filename)
        ext = os.path.splitext(filename)[1]
        unique_name = f"{uuid.uuid4()}{ext}"
        blob_path = f"plans/{plan_id}/{unique_name}"
        url = upload_to_gcs(blob_path, image, image.content_type)
        image_urls.append(url)

    created_at = datetime.utcnow()
    metadata = {
        "id": plan_id,
        **plan_data,
        "designer_id": user_id,
        "created_at": created_at.isoformat(),
        "images": image_urls
    }

    metadata_blob = f"plans/{plan_id}/metadata.json"
    upload_to_gcs(metadata_blob, file_obj=json.dumps(metadata).encode('utf-8'), content_type='application/json')

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO plans (
                id, name, category, price, status, area, bedrooms, 
                bathrooms, floors, image_url, designer_id, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            plan_id,
            plan_data['name'],
            plan_data['category'],
            plan_data['price'],
            plan_data['status'],
            plan_data['area'],
            plan_data['bedrooms'],
            plan_data['bathrooms'],
            plan_data['floors'],
            image_urls[0],  # Primary image
            user_id,
            created_at
        ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify(message=f"Database error: {str(e)}"), 500
    finally:
        cur.close()
        conn.close()

    return jsonify(message="Plan uploaded successfully.", plan_id=plan_id, image_urls=image_urls), 201



@plans_bp.route('/', methods=['GET'])
def browse_plans():
    """
    Public endpoint to browse plans with advanced filtering, search, sort, and pagination.
    Only shows plans with status='Available'.
    """
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        search = request.args.get('search', type=str)
        category = request.args.get('category', type=str)
        bedrooms = request.args.get('bedrooms', type=int)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', default='created_at', type=str)
        order = request.args.get('order', default='desc', type=str)
        limit = request.args.get('limit', default=10, type=int)
        offset = request.args.get('offset', default=0, type=int)

        allowed_sort_fields = ['price', 'sales_count', 'created_at']
        sort_by = sort_by if sort_by in allowed_sort_fields else 'created_at'
        order = 'ASC' if order.lower() == 'asc' else 'DESC'

        where_clauses = ["status = 'Available'"]
        values = []

        if search:
            where_clauses.append("LOWER(name) LIKE %s")
            values.append(f"%{search.lower()}%")
        if category:
            where_clauses.append("category = %s")
            values.append(category)
        if bedrooms is not None:
            where_clauses.append("bedrooms = %s")
            values.append(bedrooms)
        if min_price is not None:
            where_clauses.append("price >= %s")
            values.append(min_price)
        if max_price is not None:
            where_clauses.append("price <= %s")
            values.append(max_price)

        where_sql = " AND ".join(where_clauses)

        count_query = f"SELECT COUNT(*) FROM plans WHERE {where_sql};"
        cur.execute(count_query, tuple(values))
        total_count = cur.fetchone()[0]

        data_query = f"""
            SELECT id, name, category, price, area, bedrooms, bathrooms, floors,
                   sales_count, image_url, created_at
            FROM plans
            WHERE {where_sql}
            ORDER BY {sort_by} {order}
            LIMIT %s OFFSET %s;
        """
        cur.execute(data_query, tuple(values + [limit, offset]))
        plans = [dict(row) for row in cur.fetchall()]

        return jsonify({
            "metadata": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "returned": len(plans),
                "sort_by": sort_by,
                "order": order
            },
            "results": plans
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error browsing plans: {e}")
        return jsonify(error="Something went wrong"), 500
    finally:
        cur.close()
        conn.close()
