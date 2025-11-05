from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel,Field
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Interviewer(BaseModel):
    questions:list[str]

model = ChatGoogleGenerativeAI( model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key="AIzaSyCYsNSwlGlZuRqAqyjQkjoBE509s-nvkO4")

structured_model = model.with_structured_output(Interviewer)


@app.route("/api/questions", methods=["GET"])
def get_questions():
    """Generate questions and return only raw text output"""
    result = model.invoke("Give me only 15 Python interview questions.And remember last 2 questions should be coding in one line")
    result2 = structured_model.invoke(result.content)
    Allquestions = result2.questions
    return Allquestions

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)