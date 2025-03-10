from app.db.db_connection import alix_ops_db_connection, control_room_db_connection
from app.utils.logger import logger
from bson.objectid import ObjectId
from bson import json_util
from pymongo import ReturnDocument

def convert_objectid(doc):
    if isinstance(doc, list):
        return [convert_objectid(d) for d in doc]
    elif isinstance(doc, dict):
        return {k: convert_objectid(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc
    
class BaseDatabaseService:
    """Base class to manage MongoDB collections for different databases."""

    def __init__(self, db_connection, collection_name: str):
        self.db_connection = db_connection
        self.collection_name = collection_name
        self.collection = None


    async def init_collection(self):
        if self.db_connection.db is None:
            raise RuntimeError("Database connection is not initialized. Call `connect()` first.")
        self.collection = self.db_connection.db[self.collection_name]

    async def get_all_documents(self):
        await self.init_collection()
        try:
            data = self.collection.find({})
            data = await data.to_list(None)  # `None` retrieves all documents
            return convert_objectid(data)
        except Exception as e:
            logger.error(f"Error occurred getting all collection data: {e}")
            return []

class AlixOpsDatabaseService(BaseDatabaseService):
    """Base class for collections in the Alix Ops database."""

    def __init__(self, collection_name: str):
        super().__init__(alix_ops_db_connection, collection_name)

class ControlRoomDatabaseService(BaseDatabaseService):
    """Base class for collections in the Control Room database."""

    def __init__(self, collection_name: str):
        super().__init__(control_room_db_connection, collection_name)

# ------------------------- Specific Database Services -------------------------
class LogsDatabaseService(AlixOpsDatabaseService):
    def __init__(self):
        super().__init__("internal_service_logs")

    async def insert_log_entry(self, log_entry:dict):
        await self.init_collection()
        try:
            inserted_doc=await self.collection.insert_one(log_entry)
            logger.info(f"Successfully inserted log entry {inserted_doc.inserted_id}")
        except Exception as e:
            logger.error(f"Error occurred inserting log entry:{e}")

class UserDatabaseService(ControlRoomDatabaseService):
    def __init__(self):
        super().__init__("users")

    async def insert_user(self, user:dict):
        await self.init_collection()
        try:
            inserted_doc=await self.collection.insert_one(user)
            logger.info(f"Successfully inserted user {inserted_doc.inserted_id}")
        except Exception as e:
            logger.error(f"Error occurred inserting user:{e}")

    async def find_user_by_email(self, email:str)->dict:
        await self.init_collection()
        try:
            user=await self.collection.find_one({"email":email})
            return user
        except Exception as e:
            logger.error(f"Error occurred finding user:{e}")   

    async def delete_user(self, uid):
        await self.init_collection()
        try:
            await self.collection.delete_one({"uid":uid})
            logger.info(f"Successfully deleted user {uid}")
        except Exception as e:
            logger.error(f"Error occurred deleting user:{e}") 

class OrganizationDatabaseService(ControlRoomDatabaseService):
    def __init__(self):
        super().__init__("organizations")

    async def find_organization_id_by_name(self, organization_name:str)->ObjectId:
        await self.init_collection()
        try:
            organization=await self.collection.find_one({"organizationName":organization_name})
            return organization.get("_id")
        except Exception as e:
            logger.error(f"Error occurred finding organization:{e}")
            return None
        
    async def update_organization_with_uid(self, organization_id: ObjectId, uid:str):
        await self.init_collection()
        try:
            await self.collection.update_one({"_id":organization_id}, {"$push":{"organizationMembers":uid}})
            logger.info(f"Successfully updated organization {str(organization_id)}")
        except Exception as e:
            logger.error(f"Error occurred updating organization:{e}")

    async def remove_uid_from_organization(self, organization_id: ObjectId, uid:str):
        await self.init_collection()
        try:
            await self.collection.update_one({"_id":organization_id}, {"$pull":{"organizationMembers":uid}})
            logger.info(f"Successfully removed user {uid} from organization {str(organization_id)}")
        except Exception as e:
            logger.error(f"Error occurred removing user from organization:{e}")

    async def register_flow_for_organization(self, organization_id: ObjectId, flow_trigger: dict):
        await self.init_collection()
        try:
            flow_trigger_key = next(iter(flow_trigger))
            flow_trigger_value = flow_trigger[flow_trigger_key]
            await self.collection.update_one({"_id":organization_id}, {"$set":{f"triggers.{flow_trigger_key}":flow_trigger_value}})
        except Exception as e:
            logger.error(f"Error occurred registering flow for organization:{e}")

class FlowDatabaseService(ControlRoomDatabaseService):
    def __init__(self):
        super().__init__("flows")

    async def insert_flow(self, flow:dict):
        await self.init_collection()
        try:
            inserted_doc=await self.collection.insert_one(flow)
            logger.info(f"Successfully inserted flow {inserted_doc.inserted_id}")
        except Exception as e:
            logger.error(f"Error occurred inserting flow:{e}")

class AlixOpsUserService(AlixOpsDatabaseService):
    def __init__(self):
        super().__init__("users")
    async def login_user(self, user_data:dict):
        await self.init_collection()
        try:
            uid=user_data['uid']
            existing_user=await self.collection.find_one({"uid":uid}, {"_id":0})
            print(existing_user)
            if existing_user:
                logger.info(f"Found existing user, returning data for {existing_user['uid']}")
                update_fields={
                }
                for key, value in user_data.items():
                    if key not in existing_user:
                        update_fields[key]=value
                if update_fields:
                    updated_user=await self.collection.find_one_and_update(filter={"uid":uid}, projection={"_id":0}, update={"$set":update_fields}, return_document=ReturnDocument.AFTER)
                    return updated_user
                return existing_user
        except Exception as e:
            logger.error(f"Error occurred inserting user:{e}")
    



