# models/enrollment.py
from mongoengine import Document, ReferenceField, DateTimeField, StringField, signals, CASCADE, NULLIFY
from datetime import datetime
from .user import User
from .course import Course

class Enrollment(Document):
    meta = {
        "collection": "enrollments",
        "indexes": [
            {"fields": ["user", "course"], "unique": True},  # prevent duplicate enrolls
            {"fields": ["user", "-created_at"]},
        ]
    }

    user   = ReferenceField(User, required=True, reverse_delete_rule=CASCADE)
    course = ReferenceField(Course, required=True, reverse_delete_rule=NULLIFY)
    status = StringField(choices=("active", "completed", "cancelled"), default="active")
    created_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "user": str(self.user.id) if self.user else None,
            "course": str(self.course.id) if self.course else None,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
