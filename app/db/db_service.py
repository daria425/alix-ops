from app.db.db_connection import db_connection
from app.utils.logger import logger

class DatabaseService:
    """Base class to manage MongoDB collection"""
    def __init__(self, collection_name:str):
        self.collection_name=collection_name
        self.collection=None
    async def init_collection(self):
        if db_connection.db is None:
            raise RuntimeError("Database connection is not initialized. Call `connect()` first.")
        self.collection=db_connection.db[self.collection_name]

class LogsDatabaseService(DatabaseService):
    def __init__(self):
        super().__init__("internal_service_logs")

    async def insert_log_entry(self, log_entry:dict):
        await self.init_collection()
        try:
            inserted_doc=await self.collection.insert_one(log_entry)
            logger.info(f"Successfully inserted log entry {inserted_doc.inserted_id}")
        except Exception as e:
            logger.error(f"Error occurred inserting log entry:{e}")