# models/java_progress.py
from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, BooleanField, IntField
from datetime import datetime

class JavaTopic(EmbeddedDocument):
    key = StringField(required=True)      # slug/identifier
    title = StringField(required=True)    # display text
    done = BooleanField(default=False)    # completed?

class JavaProgress(Document):
    # one doc per user (clerk_id) per course ("java")
    clerk_id = StringField(required=True, unique_with='course')
    course   = StringField(required=True, default="java")
    topics   = ListField(EmbeddedDocumentField(JavaTopic))
    percent  = IntField(default=0)        # 0..100
    updated_at = StringField(default=lambda: datetime.utcnow().isoformat())

    meta = {
        "collection": "java_progress",
        "indexes": ["clerk_id", "course"]
    }

    @staticmethod
    def default_topics():
        base = [
            "Introduction & JDK/JRE/IDE setup",
            "Syntax, Variables & Data Types",
            "Operators & Expressions",
            "Control Flow (if/else, switch)",
            "Loops (for, while, do-while)",
            "Methods & Overloading",
            "Arrays & Array utility",
            "Strings & StringBuilder",
            "OOP: Classes & Objects",
            "OOP: Inheritance",
            "OOP: Polymorphism & Abstraction",
            "OOP: Interfaces & Packages",
            "Exceptions & Error Handling",
            "Collections: List/Set/Map",
            "Generics",
            "Streams & Lambda Basics",
            "File I/O (NIO.2)",
            "Multithreading & Concurrency basics",
            "JVM, JIT & Garbage Collection",
            "Build Tools & Unit Testing (Maven/JUnit)"
        ]
        out = []
        for i, t in enumerate(base, start=1):
            out.append(JavaTopic(key=f"t{i}", title=t, done=False))
        return out

    def recalc_percent(self):
        total = len(self.topics) or 1
        done  = sum(1 for t in self.topics if t.done)
        raw   = int((done * 100) / total)

        # Use exact per-topic percentage (no snapping to 10s)
        self.percent = min(100, max(0, raw))
        return self.percent
