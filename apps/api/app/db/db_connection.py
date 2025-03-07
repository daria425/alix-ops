import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.utils.logger import logger
load_dotenv()
MONGO_URI=os.getenv("MONGO_URI")
ALIX_OPS_DB_NAME=os.getenv("ALIX_OPS_DB_NAME")
CONTROL_ROOM_DB_NAME=os.getenv("CONTROL_ROOM_DB_NAME")
class DatabaseConnection:
    def __init__(self,db_name: str,  mongo_uri: str):
        self.mongo_uri = mongo_uri
        self.db_name = db_name
        self.client = None
        self.db = None

    async def connect(self):
        """Initialize MongoDB connection."""
        self.client = AsyncIOMotorClient(self.mongo_uri)
        self.db = self.client[self.db_name]
        logger.info(f"✅ Connected to MongoDB: {self.db_name}")

    async def close(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            logger.info(f"❌ Disconnected from MongoDB: {self.db_name}")

alix_ops_db_connection = DatabaseConnection(ALIX_OPS_DB_NAME, MONGO_URI)
control_room_db_connection = DatabaseConnection(CONTROL_ROOM_DB_NAME, MONGO_URI)