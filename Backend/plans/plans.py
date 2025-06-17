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
