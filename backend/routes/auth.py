from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from models.models import db, User, Applicant, Employer, University, TokenBlocklist
from werkzeug.utils import secure_filename
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # 1. Check if user already exists to prevent database errors
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already registered"}), 400

    # 2. Hash password and create the base User
    hashed_pw = generate_password_hash(data['password'])
    user = User(email=data['email'], password=hashed_pw, role=data['role'])
    db.session.add(user)
    db.session.commit() # Commit here to get the user.id
    
    # 3. Create the specific sub-profile based on the role
    # Note: We use data.get('name') to match your frontend input ID
    if data['role'] == 'applicant':
        db.session.add(Applicant(user_id=user.id, full_name=data.get('name')))
    elif data['role'] == 'employer':
        db.session.add(Employer(user_id=user.id, company_name=data.get('name')))
    elif data['role'] == 'university':
        db.session.add(University(user_id=user.id, uni_name=data.get('name')))
    
    db.session.commit()

    # 4. GENERATE TOKEN so the frontend can log them in immediately
    # JWT spec requires 'sub' (identity) to be a string
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    
    return jsonify({
        "msg": "Registered successfully",
        "access_token": token,
        "role": user.role,
        "name": data.get('name')
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        # Get the user's name from their profile table
        name = None
        if user.role == 'applicant':
            profile = Applicant.query.filter_by(user_id=user.id).first()
            name = profile.full_name if profile else None
        elif user.role == 'employer':
            profile = Employer.query.filter_by(user_id=user.id).first()
            name = profile.company_name if profile else None
        elif user.role == 'university':
            profile = University.query.filter_by(user_id=user.id).first()
            name = profile.uni_name if profile else None
        
        token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        return jsonify(access_token=token, role=user.role, name=name), 200
    return jsonify({"msg": "Bad credentials"}), 401


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Revoke the current JWT by adding its JTI to the blocklist."""
    jti = get_jwt().get('jti')
    if not jti:
        return jsonify({"msg": "Invalid token"}), 400

    try:
        db.session.add(TokenBlocklist(jti=jti))
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"msg": "Failed to revoke token"}), 500

    return jsonify({"msg": "Successfully logged out"}), 200


@auth_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    """Upload a profile picture for the current user."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'avatar' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['avatar']
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
        return jsonify({"error": "Only image files are allowed (jpg, png, webp)"}), 400

    avatar_folder = os.path.join(current_app.root_path, 'uploads', 'avatars')
    os.makedirs(avatar_folder, exist_ok=True)

    filename = secure_filename(f"avatar_{user_id}.{ext}")
    file_path = os.path.join(avatar_folder, filename)
    file.save(file_path)

    user.avatar_path = file_path
    db.session.commit()

    return jsonify({"message": "Avatar uploaded", "avatar_url": f"/auth/avatar/{user_id}"}), 200


@auth_bp.route('/avatar/<int:user_id>', methods=['GET'])
def get_avatar(user_id):
    """Serve a user's avatar image (public)."""
    user = User.query.get(user_id)
    if not user or not user.avatar_path or not os.path.exists(user.avatar_path):
        return jsonify({"error": "No avatar"}), 404

    ext = user.avatar_path.rsplit('.', 1)[-1].lower()
    mime = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
            'webp': 'image/webp', 'gif': 'image/gif'}.get(ext, 'image/jpeg')
    return send_file(user.avatar_path, mimetype=mime)


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user's id and avatar url."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "id": user.id,
        "role": user.role,
        "has_avatar": bool(user.avatar_path and os.path.exists(user.avatar_path)),
        "avatar_url": f"/auth/avatar/{user.id}" if user.avatar_path else None
    }), 200