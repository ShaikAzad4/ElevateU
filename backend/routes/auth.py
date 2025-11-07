import datetime
import os
from typing import Any, Dict

import jwt
from flask import Blueprint, current_app, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from ..db import get_db


auth_bp = Blueprint("auth", __name__)


def _generate_token(payload: Dict[str, Any]) -> str:
    secret = current_app.config["SECRET_KEY"]
    exp_minutes = int(current_app.config.get("JWT_EXP_MINUTES", 60))
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=exp_minutes)
    payload_with_exp = {**payload, "exp": exp}
    return jwt.encode(payload_with_exp, secret, algorithm="HS256")


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not name or not email or not password:
        return jsonify({"error": "name, email, password are required"}), 400

    _, db = get_db()
    users = db["users"]

    if users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    password_hash = generate_password_hash(password)
    doc = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.datetime.utcnow(),
        "updated_at": datetime.datetime.utcnow(),
    }
    res = users.insert_one(doc)
    user_id = str(res.inserted_id)
    token = _generate_token({"sub": user_id, "email": email})
    return (
        jsonify({"token": token, "user": {"_id": user_id, "name": name, "email": email}}),
        201,
    )


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    _, db = get_db()
    users = db["users"]
    user = users.find_one({"email": email})
    if not user or not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"error": "Invalid credentials"}), 401

    user_id = str(user["_id"])
    token = _generate_token({"sub": user_id, "email": email})
    return jsonify({
        "token": token,
        "user": {"_id": user_id, "name": user.get("name"), "email": user.get("email")},
    })

