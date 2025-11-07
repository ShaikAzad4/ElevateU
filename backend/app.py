from datetime import timedelta
import os
import sys
from pathlib import Path

# Add backend directory to Python path for imports
backend_dir = Path(__file__).parent.absolute()
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv


def create_app() -> Flask:
    load_dotenv()
    app = Flask(__name__)

    # Config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-me")
    # Clerk configuration
    app.config["CLERK_ISSUER"] = os.getenv("CLERK_ISSUER", "")
    app.config["CLERK_JWKS_URL"] = os.getenv("CLERK_JWKS_URL", "")
    app.config["CLERK_AUDIENCE"] = os.getenv("CLERK_AUDIENCE", "")
    app.config["MONGODB_URL"] = os.getenv(
        "MONGODB_URL",
        "mongodb+srv://ameer:RAYxlz5frwu38YsE@cluster0.9kbjn09.mongodb.net/?appName=Cluster0",
    )
    app.config["MONGODB_DB_NAME"] = os.getenv("MONGODB_DB_NAME", "elevateu")

    # CORS (allow dev ports; adjust as needed)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # JSON error handlers
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(400)
    def bad_request(err):
        return jsonify({"error": str(err)}), 400

    @app.get("/")
    def health():
        return jsonify({"status": "ok"})

    # Register blueprints
    from routes.users import users_bp

    app.register_blueprint(users_bp, url_prefix="/api/users")

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)