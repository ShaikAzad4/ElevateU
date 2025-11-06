from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.post("/api/echo")
def echo():
    data = request.get_json(silent=True)
    print("Received data:", data)
    return jsonify({
        "headers": dict(request.headers),
        "json": request.get_json(silent=True)
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
