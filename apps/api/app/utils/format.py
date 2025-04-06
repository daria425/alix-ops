from datetime import datetime
from bson import ObjectId


def convert_objectid(doc):
    if isinstance(doc, list):
        return [convert_objectid(d) for d in doc]
    elif isinstance(doc, dict):
        return {k: convert_objectid(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    else:
        return doc


def get_db_change_description(collection_name: str, db_change_document: dict) -> str:
    """Get a human-readable description of the database change."""
    if collection_name == "flow_history":
        flow_name = db_change_document.get("flowName")
        return f"New {flow_name} flow started"
    elif collection_name == "messages":
        if db_change_document.get("Direction") == "outbound":
            return f"Outbound message sent to {db_change_document.get('To')}"
        elif db_change_document.get("Direction") == "inbound":
            return f"Inbound message received from {db_change_document.get('From')}"
