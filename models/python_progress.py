from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, BooleanField, IntField
from datetime import datetime


class PythonTopic(EmbeddedDocument):
    key = StringField(required=True)
    title = StringField(required=True)
    done = BooleanField(default=False)


class PythonProgress(Document):
    clerk_id = StringField(required=True, unique_with='course')
    course = StringField(required=True, default="python")
    topics = ListField(EmbeddedDocumentField(PythonTopic))
    percent = IntField(default=0)
    updated_at = StringField(default=lambda: datetime.utcnow().isoformat())

    meta = {
        "collection": "python_progress",
        "indexes": ["clerk_id", "course"],
    }

    @staticmethod
    def default_topics():
        base = [
            "Introduction & Environment setup (Python/IDE)",
            "Syntax, Variables & Basic Types",
            "Numbers, Strings & Formatting",
            "Control Flow (if/elif/else)",
            "Loops (for/while) & Iteration",
            "Functions & Arguments",
            "Modules & Packages",
            "Virtualenv & pip",
            "File I/O",
            "Exceptions & Error Handling",
            "Data Structures: list/dict/set/tuple",
            "List/Dict Comprehensions",
            "OOP: Classes & Objects",
            "OOP: Inheritance & Polymorphism",
            "Decorators",
            "Generators & Iterators",
            "Standard Library Essentials",
            "Testing (unittest/pytest)",
            "Typing & Type Hints",
            "Packaging & Distribution",
        ]
        out = []
        for i, t in enumerate(base, start=1):
            out.append(PythonTopic(key=f"t{i}", title=t, done=False))
        return out

    def recalc_percent(self):
        total = len(self.topics) or 1
        done = sum(1 for t in self.topics if t.done)
        raw = int((done * 100) / total)
        # Use exact per-topic percentage (no snapping)
        self.percent = min(100, max(0, raw))
        return self.percent