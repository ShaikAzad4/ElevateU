# models/course.py
from mongoengine import Document, StringField, FloatField, DateTimeField
from datetime import datetime

class Course(Document):
    meta = {
        "collection": "courses",
        "indexes": ["title", "-created_at"]
    }

    title = StringField(required=True, min_length=2, max_length=200)
    price = FloatField(required=True, min_value=0)
    tutor = StringField(required=True, min_length=2, max_length=200)
    duration = StringField(required=True, max_length=100)  # e.g., "8 weeks"
    curriculum = StringField(required=True)                # long text OK
    created_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "price": self.price,
            "tutor": self.tutor,
            "duration": self.duration,
            "curriculum": self.curriculum,
            "created_at": self.created_at.isoformat() + "Z",
        }
