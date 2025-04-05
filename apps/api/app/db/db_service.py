from app.db.db_connection import alix_ops_db_connection, control_room_db_connection
from app.utils.logger import logger
from app.utils.dates import fill_dates
from bson.objectid import ObjectId
from datetime import datetime, timedelta, timezone
from pymongo import ReturnDocument
import math

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

    async def get_all_documents(self, filters=None, use_pagination=False, page=1, page_size=10):
        await self.init_collection()
        try:
            query = filters or {}
            total_count = await self.collection.count_documents(query)
            
            if use_pagination:
                skip = (page - 1) * page_size
                
                # Get paginated results
                cursor = self.collection.find(query).skip(skip).limit(page_size)
                documents = convert_objectid(await cursor.to_list(None))
                
                return {
                    "documents": documents,
                    "total_count": total_count,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": math.ceil(total_count / page_size) if page_size > 0 else 1
                }
            else:
                # Get all results
                cursor = self.collection.find(query)
                documents = convert_objectid(await cursor.to_list(None))
                
                return {
                    "documents": documents,
                    "total_count": total_count,
                    "page": 1,
                    "page_size": total_count,
                    "total_pages": 1
                }
        
        except Exception as e:
                logger.error(f"Error occurred getting all collection data: {e}")
                return {"documents": [], "total_count": 0, "page": page, "page_size": page_size, "total_pages": 0}

class AlixOpsDatabaseService(BaseDatabaseService):
    """Base class for collections in the Alix Ops database."""

    def __init__(self, collection_name: str):
        super().__init__(alix_ops_db_connection, collection_name)

class ControlRoomDatabaseService(BaseDatabaseService):
    """Base class for collections in the Control Room database."""

    def __init__(self, collection_name: str):
        super().__init__(control_room_db_connection, collection_name)

# ------------------------- Specific Database Services -------------------------
class HealthCheckLogsDatabaseService(AlixOpsDatabaseService):
    def __init__(self):
        super().__init__("internal_service_logs")

    async def insert_log_entry(self, log_entry:dict):
        await self.init_collection()
        try:
            inserted_doc=await self.collection.insert_one(log_entry)
            logger.info(f"Successfully inserted log entry {inserted_doc.inserted_id}")
        except Exception as e:
            logger.error(f"Error occurred inserting log entry:{e}")

class UptimeLogsDatabaseService(AlixOpsDatabaseService):
    def __init__(self):
        super().__init__("uptime_logs") 
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
    
class MessageDatabaseService(ControlRoomDatabaseService):
    def __init__(self):
        super().__init__("messages")
    
    async def get_daily_message_counts(self):
        await self.init_collection()
        try:
            pipeline = [
                        {
                            "$project": {
                                "day": {
                                    "$dateToString": {"format": "%Y-%m-%d", "date": "$CreatedAt"}
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": "$day",  # Group by day
                                "messagesSent": {"$sum": 1}  # Count messages
                            }
                        },
                        {
                            "$sort": {"_id": 1}  # Sort by date
                        }
                    ]
            result = await self.collection.aggregate(pipeline).to_list(None)
            messages_by_date = {doc["_id"]: doc["messagesSent"] for doc in result}

            # Calculate total count
            total_count = sum(messages_by_date.values())

            # Fill missing dates (if needed)
            messages_by_date = fill_dates(messages_by_date)

            # Return data with total count
            return {
                "daily_counts": messages_by_date,
                "total_count": total_count
            }
        except Exception as e:
                logger.error(f"Error occurred counting messages:{e}")
        
class FlowHistoryDatabaseService(ControlRoomDatabaseService):
    def __init__(self):
        super().__init__("flow_history")
    async def get_daily_flow_counts(self):
        await self.init_collection()
        try:
            pipeline = [
                {
                    "$match": {
                        "flowName": {"$ne": "latency-test"}  # Filter out latency-test flows
                    }
                },
                {
                    "$project": {
                        "day": {
                            "$dateToString": {"format": "%Y-%m-%d", "date": "$CreatedAt"}
                        },
                        "flowName": 1  # Keep the flow name
                    }
                },
                {
                    "$group": {
                        "_id": "$day",  # Group by day
                        "flowsStarted": {"$sum": 1}  # Count flows
                    }
                },
                {
                    "$sort": {"_id": 1}  # Sort by date
                }
            ]
            result = await self.collection.aggregate(pipeline).to_list(None)
            flows_by_date = {doc["_id"]: doc["flowsStarted"] for doc in result}
            total_count = sum(flows_by_date.values())   
            flows_by_date = fill_dates(flows_by_date)   
            return {
                "daily_counts": flows_by_date,
                "total_count": total_count
            }
        except Exception as e:
            logger.error(f"Error occurred counting flows:{e}")  
    async def get_flows_by_timeframe(self, time:int):
        """Get all flows started in the given timeframe
        Args:
            time (int): Timeframe in seconds
        """
        await self.init_collection()
        try:
            end_time = datetime.now(timezone.utc)
            start_time = end_time - timedelta(seconds=time)
            query = {
                "CreatedAt": {
                    "$gte": start_time,
                    "$lte": end_time
                },
                "flowName": {"$ne": "latency-test"}  # Filter out latency-test flows
            }
      
            flows = await self.get_all_documents(query)
            return flows
        except Exception as e:
            logger.error(f"Error occurred getting flows by timeframe:{e}")

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
                    if key not in existing_user or existing_user[key]!=value:
                        update_fields[key]=value
                if update_fields:
                    updated_user=await self.collection.find_one_and_update(filter={"uid":uid}, projection={"_id":0}, update={"$set":update_fields}, return_document=ReturnDocument.AFTER)
                    return updated_user
                return existing_user
        except Exception as e:
            logger.error(f"Error occurred inserting user:{e}")

class ErrorDatabaseService(AlixOpsDatabaseService):
    def __init__(self):
        super().__init__("error_logs")
    async def insert_error(self, error_data:dict):
        await self.init_collection()
        try:
            inserted_doc=await self.collection.insert_one(error_data)
            logger.info(f"Successfully inserted error {inserted_doc.inserted_id}")
        except Exception as e:
            logger.error(f"Error occurred inserting error:{e}")

    



