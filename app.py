from flask import Flask, request, jsonify
from flask_cors import CORS
from mongoengine import connect, NotUniqueError, ValidationError
from pymongo.errors import DuplicateKeyError
from mongoengine.connection import get_db
from dotenv import load_dotenv
import os
from models.enrollment import Enrollment
from bson import ObjectId

load_dotenv()

from models.user import User
from models.course import Course

app = Flask(__name__)

# ✅ ONE CORS INIT ONLY — covers preflight (OPTIONS), headers, methods, and your dev origins
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]}},
    supports_credentials=False,  # set True only if you actually send cookies/Authorization
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    max_age=86400,
)

# Optional: belt-and-suspenders to ensure headers are present on every response
@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if origin in {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"}:
        resp.headers.setdefault("Access-Control-Allow-Origin", origin)
        resp.headers.setdefault("Vary", "Origin")
        resp.headers.setdefault("Access-Control-Allow-Headers", "Content-Type, Authorization")
        resp.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    return resp

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not set in .env")
connect(host=MONGODB_URI)

print("=== MONGO DEBUG ===")
print("MONGODB_URI:", MONGODB_URI)
try:
    print("Connected DB name:", get_db().name)
except Exception as e:
    print("DB name check failed:", e)
print("====================")

@app.post("/api/echo")
def echo():
    data = request.get_json(silent=True)
    print("Received /api/echo:", data)
    return jsonify({"headers": dict(request.headers), "json": data}), 200

# ---------- CREATE (gentle upsert) ----------
@app.post("/api/users")
def create_user():
    payload = request.get_json(silent=True) or {}
    print("HIT /api/users ->", payload)

    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "")
    email = email.strip().lower() if isinstance(email, str) else ""
    clerk_id = payload.get("clerk_id") or payload.get("id") or None
    role = payload.get("role")

    if (name or "").lower() == "admin":
        if not email:
            email = "admin@gmail.com"
        role = "admin"

    if not name:
        return jsonify({"error": "name is required"}), 400
    if not email:
        return jsonify({"error": "email is required"}), 400

    if role is not None:
        if isinstance(role, str):
            role = role.strip().lower()
        if role not in (None, "user", "admin"):
            return jsonify({"error": "invalid role; must be 'user' or 'admin'"}), 400

    try:
        if clerk_id:
            existing_by_clerk = User.objects(clerk_id=clerk_id).first()
            if existing_by_clerk:
                return jsonify(existing_by_clerk.to_dict()), 200

        existing_by_email = User.objects(email=email).first()
        if existing_by_email:
            if clerk_id and not existing_by_email.clerk_id:
                if name:
                    existing_by_email.name = name
                if role:
                    existing_by_email.role = role
                existing_by_email.clerk_id = clerk_id
                existing_by_email.save()
                return jsonify(existing_by_email.to_dict()), 200
            return jsonify({"error": "email already exists"}), 409

        user_kwargs = {"name": name, "email": email}
        if role:
            user_kwargs["role"] = role
        if clerk_id:
            user_kwargs["clerk_id"] = clerk_id

        user = User(**user_kwargs).save()
        return jsonify(user.to_dict()), 201

    except (NotUniqueError, DuplicateKeyError) as e:
        msg = str(e).lower()
        field = "email"
        if "clerk_id" in msg:
            field = "clerk_id"
        return jsonify({"error": f"{field} already exists"}), 409
    except ValidationError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "failed to create user", "details": str(e)}), 500

# ---------- LIST ----------
@app.get("/api/users")
def list_users():
    users = [u.to_dict() for u in User.objects.only("id", "clerk_id", "name", "email", "created_at", "role")]
    return jsonify(users), 200

@app.route("/api/user/sync", methods=["POST", "OPTIONS"])
def sync_user():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    clerk_id = data.get("clerk_id") or data.get("id")
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip() or "User"

    print("[SYNC] clerk_id:", repr(clerk_id), " email:", repr(email), " name:", repr(name))

    if not clerk_id or not email:
        return jsonify({"error": "clerk_id and email are required"}), 400

    try:
        # 1️⃣ Already linked by clerk_id → return user
        u = User.objects(clerk_id=clerk_id).first()
        if u:
            print("[SYNC] found by clerk_id")
            u.reload()
            return jsonify(u.to_dict()), 200

        # 2️⃣ Existing by email → attach clerk_id and update fields
        u = User.objects(email=email).first()
        if u:
            print("[SYNC] found by email -> attaching clerk_id")

            if not u.clerk_id:
                u.clerk_id = clerk_id

            if name and u.name != name:
                u.name = name

            # ✅ FIX: enforce admin role when name contains 'admin'
            if "admin" in (u.name or "").strip().lower():
                u.role = "admin"
            elif u.role not in ("user", "admin"):
                u.role = "user"

            # ✅ ensure model clean() runs and changes persist
            u.validate()
            u.save()
            u.reload()

            print("[SYNC] after save, clerk_id now:", u.clerk_id)
            print("[SYNC] user role now:", u.role)
            return jsonify(u.to_dict()), 200

        # 3️⃣ Create new user
        print("[SYNC] creating new user")
        u = User(name=name, email=email, clerk_id=clerk_id)

        # ✅ enforce admin role on creation
        if "admin" in (u.name or "").strip().lower():
            u.role = "admin"

        u.validate()   # run clean() from User model
        u.save()
        u.reload()

        print("[SYNC] created user with clerk_id:", u.clerk_id, " role:", u.role)
        return jsonify(u.to_dict()), 201

    except (NotUniqueError, DuplicateKeyError) as e:
        msg = str(e).lower()
        field = "email"
        if "clerk_id" in msg:
            field = "clerk_id"
        return jsonify({"error": f"{field} already exists"}), 409
    except ValidationError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print("[SYNC][ERROR]", e)
        return jsonify({"error": "sync failed", "details": str(e)}), 500


# ---------- GET BY CLERK ID ----------
@app.get("/api/user/<clerk_id>")
def get_user_by_clerk_id(clerk_id):
    print("[LOOKUP] clerk_id param =", repr(clerk_id))
    user = User.objects(clerk_id=clerk_id).only(
        "id", "clerk_id", "name", "email", "created_at", "role"
    ).first()
    print("[LOOKUP] found?", bool(user))
    if not user:
        existing = list(User.objects.scalar('clerk_id'))
        print("[LOOKUP] existing clerk_ids in DB:", existing)
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200


# ---------- COURSES: CREATE ----------
@app.post("/api/courses")
def create_course():
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    tutor = (payload.get("tutor") or "").strip()
    duration = (payload.get("duration") or "").strip()
    curriculum = (payload.get("curriculum") or "").strip()

    # convert price safely
    try:
        price = float(payload.get("price"))
    except (TypeError, ValueError):
        price = None

    # basic validation
    if not title:      return jsonify({"error": "title is required"}), 400
    if price is None:  return jsonify({"error": "price must be a number"}), 400
    if price < 0:      return jsonify({"error": "price must be >= 0"}), 400
    if not tutor:      return jsonify({"error": "tutor is required"}), 400
    if not duration:   return jsonify({"error": "duration is required"}), 400
    if not curriculum: return jsonify({"error": "curriculum is required"}), 400

    try:
        course = Course(
            title=title,
            price=price,
            tutor=tutor,
            duration=duration,
            curriculum=curriculum
        ).save()
        return jsonify(course.to_dict()), 201
    except Exception as e:
        return jsonify({"error": "failed to create course", "details": str(e)}), 500

# ---------- COURSES: LIST ----------
@app.get("/api/courses")
def list_courses():
    courses = [c.to_dict() for c in Course.objects.order_by("-created_at")]
    return jsonify(courses), 200

# ---------- COURSES: GET BY ID (optional) ----------
@app.get("/api/courses/<course_id>")
def get_course(course_id):
    try:
        c = Course.objects(id=course_id).first()
        if not c:
            return jsonify({"error": "course not found"}), 404
        return jsonify(c.to_dict()), 200
    except Exception:
        return jsonify({"error": "invalid id"}), 400

@app.post("/api/enroll")
def enroll_course():
    data = request.get_json(silent=True) or {}
    clerk_id = (data.get("clerk_id") or data.get("id") or "").strip()
    course_id = (data.get("course_id") or "").strip()

    if not clerk_id or not course_id:
        return jsonify({"error": "clerk_id and course_id are required"}), 400

    # 1) find user
    user = User.objects(clerk_id=clerk_id).first()
    if not user:
        return jsonify({"error": "user not found"}), 404

    # 2) validate course id
    try:
        course = Course.objects(id=course_id).first()
    except Exception:
        course = None
    if not course:
        return jsonify({"error": "course not found"}), 404

    # 3) create or return existing
    try:
        enrollment = Enrollment.objects(user=user, course=course).first()
        if not enrollment:
            enrollment = Enrollment(user=user, course=course).save()
        return jsonify({
            "message": "enrolled",
            "enrollment": enrollment.to_dict(),
            "course": course.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"error": "failed to enroll", "details": str(e)}), 500

@app.get("/api/my-courses")
def my_courses():
    clerk_id = (request.args.get("clerk_id") or "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id is required"}), 400

    user = User.objects(clerk_id=clerk_id).first()
    if not user:
        return jsonify({"error": "user not found"}), 404

    enrolls = Enrollment.objects(user=user, status="active").order_by("-created_at").select_related()
    courses = []
    for en in enrolls:
        if en.course:
            c = en.course.to_dict()
            c["enrollment_id"] = str(en.id)
            c["enrolled_at"] = en.created_at.isoformat()
            courses.append(c)

    return jsonify(courses), 200

@app.delete("/api/enroll/<enrollment_id>")
def unenroll(enrollment_id):
    en = Enrollment.objects(id=enrollment_id).first()
    if not en:
        return jsonify({"error": "enrollment not found"}), 404
    en.delete()
    return jsonify({"message": "unenrolled"}), 200


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
