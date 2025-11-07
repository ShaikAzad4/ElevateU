import datetime
from functools import wraps
from typing import Any, Dict
from bson import ObjectId
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from db import get_db
from auth import verify_clerk_token_from_request, AuthError


users_bp = Blueprint("users", __name__)


def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            claims = verify_clerk_token_from_request()
        except AuthError as e:
            return jsonify({"error": str(e)}), 401
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401
        request.user = {"clerk_sub": claims.get("sub"), "email": claims.get("email")}
        return fn(*args, **kwargs)

    return wrapper


def _serialize_user(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "_id": str(doc["_id"]),
        "name": doc.get("name"),
        "email": doc.get("email"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }


@users_bp.get("")
@auth_required
def list_users():
    _, db = get_db()
    users = db["users"]
    docs = list(users.find({}, {"password_hash": 0}))
    return jsonify([_serialize_user(d) for d in docs])


@users_bp.get("/<user_id>")
@auth_required
def get_user(user_id: str):
    _, db = get_db()
    users = db["users"]
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user id"}), 400
    doc = users.find_one({"_id": oid}, {"password_hash": 0})
    if not doc:
        return jsonify({"error": "User not found"}), 404
    return jsonify(_serialize_user(doc))


@users_bp.post("")
@auth_required
def create_user():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not name or not email:
        return jsonify({"error": "name and email are required"}), 400
    _, db = get_db()
    users = db["users"]
    if users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 409
    doc = {
        "name": name,
        "email": email,
        # Clerk-managed auth; no password stored
        "created_at": datetime.datetime.utcnow(),
        "updated_at": datetime.datetime.utcnow(),
    }
    res = users.insert_one(doc)
    return jsonify({"_id": str(res.inserted_id)}), 201


@users_bp.put("/<user_id>")
@auth_required
def update_user(user_id: str):
    data = request.get_json(silent=True) or {}
    updates: Dict[str, Any] = {}
    if "name" in data:
        updates["name"] = (data.get("name") or "").strip()
    if "email" in data:
        updates["email"] = (data.get("email") or "").strip().lower()
    if "password" in data and data.get("password"):
        updates["password_hash"] = generate_password_hash(data["password"]) 
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400
    updates["updated_at"] = datetime.datetime.utcnow()

    _, db = get_db()
    users = db["users"]
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user id"}), 400
    result = users.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"updated": True})


@users_bp.delete("/<user_id>")
@auth_required
def delete_user(user_id: str):
    _, db = get_db()
    users = db["users"]
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user id"}), 400
    res = users.delete_one({"_id": oid})
    if res.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"deleted": True})


@users_bp.post("/sync")
@auth_required
def sync_user():
    """Upsert user profile from Clerk identity.

    Body: { clerk_id, email, name }
    If user exists by clerk_id or email, update; otherwise insert.
    """
    data = request.get_json(silent=True) or {}
    clerk_id = (data.get("clerk_id") or "").strip()
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip()
    if not clerk_id or not email:
        return jsonify({"error": "clerk_id and email are required"}), 400

    _, db = get_db()
    users = db["users"]

    existing = users.find_one({"$or": [{"clerk_id": clerk_id}, {"email": email}]})
    now = datetime.datetime.utcnow()
    if existing:
        updates: Dict[str, Any] = {"clerk_id": clerk_id, "email": email, "updated_at": now}
        if name:
            updates["name"] = name
        users.update_one({"_id": existing["_id"]}, {"$set": updates})
        doc = users.find_one({"_id": existing["_id"]}, {"password_hash": 0})
        return jsonify(_serialize_user(doc))
    else:
        doc = {
            "clerk_id": clerk_id,
            "email": email,
            "name": name,
            "created_at": now,
            "updated_at": now,
        }
        res = users.insert_one(doc)
        doc["_id"] = res.inserted_id
        return jsonify(_serialize_user(doc)), 201

