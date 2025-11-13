from mongoengine import Document, StringField, DateTimeField
from datetime import datetime

class ProgressLog(Document):
    meta = {
        "collection": "progress_logs",
        "indexes": ["clerk_id", "course", "-created_at"],
    }

    clerk_id = StringField(required=True)
    course = StringField(required=True)
    topic_key = StringField(required=False)
    topic_title = StringField(required=False)
    note = StringField(required=False)
    created_at = DateTimeField(default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "clerk_id": self.clerk_id,
            "course": self.course,
            "topic_key": self.topic_key,
            "topic_title": self.topic_title,
            "note": self.note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }