# from mongoengine import Document, StringField, EmailField, DateTimeField
# from datetime import datetime

# class User(Document):
#     meta = {
#         "collection": "users",
#         "indexes": [
#             {"fields": ["email"], "unique": True},
#             {"fields": ["clerk_id"], "unique": True, "sparse": True},  # important: sparse!
#         ],
#     }

#     # Clerk user id from frontend (e.g., "user_abc123")
#     clerk_id = StringField(required=False, unique=True, sparse=True)
#     name = StringField(required=True, max_length=120)
#     email = EmailField(required=True, unique=True)
#     role = StringField(required=True, choices=["user", "admin"], default="user")
#     created_at = DateTimeField(default=datetime.utcnow)

#     def clean(self):
#         """
#         - If name is 'admin' (case-insensitive), force role='admin'.
#         - If that 'admin' has no email, default to 'admin@gmail.com'.
#         - Otherwise, keep role within allowed choices (fallback to 'user').
#         """
#         if self.name and self.name.strip().lower() == "admin":
#             self.role = "admin"
#             if not self.email or not str(self.email).strip():
#                 self.email = "admin@gmail.com"
#         else:
#             if self.role not in ["user", "admin"]:
#                 self.role = "user"

#     def to_dict(self):
#         return {
#             "id": str(self.id),  # MongoDB ObjectId (stringified for JSON)
#             "clerk_id": self.clerk_id,  # your frontend/Clerk id
#             "name": self.name,
#             "email": self.email,
#             "role": self.role,
#             "created_at": self.created_at.isoformat() + "Z" if self.created_at else None,
#         }


# models/user.py
# from mongoengine import Document, StringField, EmailField, DateTimeField
# from datetime import datetime

# class User(Document):
#     meta = {
#         "collection": "users",
#         "indexes": [
#             {"fields": ["email"], "unique": True},
#             {"fields": ["clerk_id"], "unique": True, "sparse": True},  # allow nulls/absent values
#         ],
#     }

#     # Clerk user id from frontend (e.g., "user_xxx"). Not required for legacy rows.
#     clerk_id = StringField(required=False, unique=True, sparse=True)
#     name = StringField(required=True, max_length=120)
#     email = EmailField(required=True, unique=True)
#     role = StringField(choices=["user", "admin"], default="user", required=True)
#     created_at = DateTimeField(default=datetime.utcnow)

#     def clean(self):
#         """
#         Normalize and enforce invariants before save:
#         - Lowercase/trim email for uniqueness consistency.
#         - If name is 'admin' (case-insensitive), force role='admin'.
#         - If name is 'admin' and email is blank (shouldn't happen via API), default email.
#         - Ensure role is one of the allowed values (fallback to 'user').
#         """
#         # Normalize email
#         if self.email:
#             self.email = str(self.email).strip().lower()

#         # Normalize/trim name
#         if self.name:
#             self.name = self.name.strip()

#         # Admin rules
#         if self.name and self.name.lower() == "admin":
#             self.role = "admin"
#             if not self.email or not str(self.email).strip():
#                 self.email = "admin@gmail.com"
#         else:
#             if self.role not in ("user", "admin"):
#                 self.role = "user"

#         # Normalize clerk_id (no change to value, but ensure trimmed)
#         if self.clerk_id is not None:
#             self.clerk_id = self.clerk_id.strip() or None  # keep None so sparse index applies

#     def to_dict(self):
#         return {
#             "id": str(self.id),
#             "clerk_id": self.clerk_id,
#             "name": self.name,
#             "email": self.email,
#             "role": self.role,
#             "created_at": self.created_at.isoformat() if self.created_at else None,
#         }



# models/user.py
# from mongoengine import Document, StringField, DateTimeField
# from datetime import datetime

# class User(Document):
#     name = StringField(required=True)
#     email = StringField(required=True, unique=True)           # unique email
#     role = StringField(default="user", choices=("user", "admin"))
#     clerk_id = StringField(unique=True, sparse=True)          # Clerk user id (may be absent for older rows)
#     created_at = DateTimeField(default=datetime.utcnow)

#     meta = {
#         "indexes": [
#             {"fields": ["email"], "unique": True},
#             {"fields": ["clerk_id"], "unique": True, "sparse": True},
#         ]
#     }

#     def to_dict(self):
#         return {
#             "id": str(self.id),
#             "name": self.name,
#             "email": self.email,
#             "role": self.role,
#             "clerk_id": self.clerk_id,
#             "created_at": self.created_at.isoformat() if self.created_at else None,
#         }


# models/user.py
from mongoengine import Document, StringField, EmailField, DateTimeField, signals
from datetime import datetime

class User(Document):
    meta = {
        "collection": "users",
        "indexes": [
            {"fields": ["email"], "unique": True},
            {"fields": ["clerk_id"], "unique": True, "sparse": True},  # allow null/absent
        ],
    }

    # Clerk user id from frontend (e.g., "user_xxx"). Optional for legacy rows.
    clerk_id = StringField(required=False, unique=True, sparse=True)
    name = StringField(required=True, max_length=120)
    email = EmailField(required=True, unique=True)
    role = StringField(choices=["user", "admin"], default="user", required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    # --- Validation / normalization before save ---
    def clean(self):
        """
        Normalize and enforce invariants:
        - Lowercase/trim email for uniqueness consistency.
        - Trim name.
        - If name is 'admin' (case-insensitive), force role='admin'.
        - Otherwise ensure role is one of the allowed values (fallback to 'user').
        - Trim clerk_id; set to None if blank so sparse index applies.
        """
        if self.email:
            self.email = str(self.email).strip().lower()

        if self.name:
            self.name = self.name.strip()

        if self.clerk_id is not None:
            self.clerk_id = self.clerk_id.strip() or None

        if self.name and self.name.lower() == "admin":
            self.role = "admin"
            # Optional safety: ensure email present for admin rows
            if not self.email or not str(self.email).strip():
                self.email = "admin@gmail.com"
        else:
            if self.role not in ("user", "admin"):
                self.role = "user"

    # --- Signal hook to enforce the 'admin' rule even if clean/validate is skipped ---
    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        # Normalize minimal fields
        if document.email:
            document.email = str(document.email).strip().lower()
        if document.name:
            document.name = document.name.strip()
        if document.clerk_id is not None:
            document.clerk_id = document.clerk_id.strip() or None

        # Enforce role based on name
        if document.name and document.name.lower() == "admin":
            document.role = "admin"
            if not document.email or not str(document.email).strip():
                document.email = "admin@gmail.com"
        elif document.role not in ("user", "admin"):
            document.role = "user"

    # Connect the signal
    @classmethod
    def _register_signals(cls):
        signals.pre_save.connect(cls.pre_save, sender=cls)

# Register signals once the class is defined
User._register_signals()

def _iso(dt):
    return dt.isoformat() if dt else None

# Keep to_dict as a simple function on the class for clarity
def _user_to_dict(self: User):
    return {
        "id": str(self.id),
        "clerk_id": self.clerk_id,
        "name": self.name,
        "email": self.email,
        "role": self.role,
        "created_at": _iso(self.created_at),
    }

# Bind to_dict
User.to_dict = _user_to_dict
