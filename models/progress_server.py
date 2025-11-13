# progress_server.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from mongoengine import connect, NotUniqueError
from dotenv import load_dotenv

load_dotenv()

from .java_progress import JavaProgress
from .python_progress import PythonProgress

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not set in .env")

app = Flask(__name__)
# Allow dev origins including Vite on 5173/5174 and React on 3000
CORS(app, resources={r"/progress/*": {"origins": [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]}})

connect(host=MONGODB_URI)

# --- helpers ---
def get_or_create_progress(clerk_id: str) -> JavaProgress:
    doc = JavaProgress.objects(clerk_id=clerk_id, course="java").first()
    if doc:
        return doc
    try:
        doc = JavaProgress(clerk_id=clerk_id, course="java", topics=JavaProgress.default_topics())
        doc.recalc_percent()
        doc.save()
        return doc
    except NotUniqueError:
        return JavaProgress.objects(clerk_id=clerk_id, course="java").first()

def get_or_create_python(clerk_id: str) -> PythonProgress:
    doc = PythonProgress.objects(clerk_id=clerk_id, course="python").first()
    if doc:
        return doc
    try:
        doc = PythonProgress(clerk_id=clerk_id, course="python", topics=PythonProgress.default_topics())
        doc.recalc_percent()
        doc.save()
        return doc
    except NotUniqueError:
        return PythonProgress.objects(clerk_id=clerk_id, course="python").first()

# --- API ---
@app.get("/progress/java/topics")
def list_topics():
    clerk_id = (request.args.get("clerk_id") or "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id is required"}), 400

    prog = get_or_create_progress(clerk_id)
    return jsonify({
        "clerk_id": clerk_id,
        "course": prog.course,
        "percent": prog.percent,
        "topics": [{"key": t.key, "title": t.title, "done": t.done} for t in prog.topics]
    }), 200

@app.get("/progress/python/topics")
def list_python_topics():
    clerk_id = (request.args.get("clerk_id") or "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id is required"}), 400

    prog = get_or_create_python(clerk_id)
    return jsonify({
        "clerk_id": clerk_id,
        "course": prog.course,
        "percent": prog.percent,
        "topics": [{"key": t.key, "title": t.title, "done": t.done} for t in prog.topics]
    }), 200

@app.post("/progress/java/complete")
def mark_complete():
    data = request.get_json(silent=True) or {}
    clerk_id = (data.get("clerk_id") or "").strip()
    key = (data.get("topic_key") or "").strip()

    if not clerk_id or not key:
        return jsonify({"error": "clerk_id and topic_key are required"}), 400

    prog = get_or_create_progress(clerk_id)

    touched = False
    for t in prog.topics:
        if t.key == key:
            t.done = True
            touched = True
            break

    if not touched:
        return jsonify({"error": "topic_key not found"}), 404

    percent = prog.recalc_percent()
    prog.save()
    return jsonify({"message": "updated", "percent": percent}), 200

@app.post("/progress/python/complete")
def mark_python_complete():
    data = request.get_json(silent=True) or {}
    clerk_id = (data.get("clerk_id") or "").strip()
    key = (data.get("topic_key") or "").strip()

    if not clerk_id or not key:
        return jsonify({"error": "clerk_id and topic_key are required"}), 400

    prog = get_or_create_python(clerk_id)

    touched = False
    for t in prog.topics:
        if t.key == key:
            t.done = True
            touched = True
            break

    if not touched:
        return jsonify({"error": "topic_key not found"}), 404

    percent = prog.recalc_percent()
    prog.save()
    return jsonify({"message": "updated", "percent": percent}), 200

@app.post("/progress/java/reset")
def reset_progress():
    data = request.get_json(silent=True) or {}
    clerk_id = (data.get("clerk_id") or "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id is required"}), 400

    prog = get_or_create_progress(clerk_id)
    for t in prog.topics:
        t.done = False
    prog.recalc_percent()
    prog.save()
    return jsonify({"message": "reset", "percent": prog.percent}), 200

@app.post("/progress/python/reset")
def reset_python_progress():
    data = request.get_json(silent=True) or {}
    clerk_id = (data.get("clerk_id") or "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id is required"}), 400

    prog = get_or_create_python(clerk_id)
    for t in prog.topics:
        t.done = False
    prog.recalc_percent()
    prog.save()
    return jsonify({"message": "reset", "percent": prog.percent}), 200

if __name__ == "__main__":
    # run isolated service
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
