import os
from typing import Tuple

from flask import current_app
from pymongo import MongoClient, ASCENDING
from pymongo.collection import Collection
from pymongo.database import Database


_client: MongoClient | None = None


def get_db() -> Tuple[MongoClient, Database]:
    global _client
    if _client is None:
        mongo_url = current_app.config["MONGODB_URL"]
        _client = MongoClient(mongo_url, uuidRepresentation="standard")
    db_name = current_app.config["MONGODB_DB_NAME"]
    db = _client[db_name]
    _ensure_indexes(db)
    return _client, db


def _ensure_indexes(db: Database) -> None:
    users: Collection = db["users"]
    users.create_index([("email", ASCENDING)], unique=True, name="unique_email")
    users.create_index([("clerk_id", ASCENDING)], unique=True, sparse=True, name="unique_clerk_id")

