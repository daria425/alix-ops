import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from app.core.internal_service_monitor import InternalServiceMonitor
from app.services.cloud_logger import CloudLogger
from app.db.db_service import BaseDatabaseService
from app.utils.format import convert_objectid, get_db_change_description
from app.utils.logger import logger

from datetime import datetime, timezone, timedelta
class WebsocketManager:
    def __init__(self):
        self.clients=set()
        self.lock=asyncio.Lock()
        self.last_log_time=None
                

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.clients.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            self.clients.discard(websocket)

    async def send_monitoring_data(self, internal_service_monitor: InternalServiceMonitor):
        while self.clients:
            await asyncio.sleep(5)
            disconnected_clients=[]
            for client in self.clients:
                try:
                    logger.info("Pinging services...")
                    responses=internal_service_monitor.get_internal_service_responses()
                    logger.info(f"Responses recieved: {responses}")
                    now = datetime.now(timezone.utc)
                    hours_24_ago = now - timedelta(hours=24)
                    time_filter = {
                        "timestamp": {
                            "$gte": hours_24_ago,
                            "$lte": now
                        }
                    }
                    await client.send_json(responses)
                except WebSocketDisconnect:
                    disconnected_clients.append(client)
            async with self.lock:  # Remove disconnected clients safely
                for client in disconnected_clients:
                        self.clients.remove(client)
            
    async def send_latency_test_data(self, internal_service_monitor: InternalServiceMonitor):
        while self.clients:
            await asyncio.sleep(5)
            disconnected_clients=[]
            for client in self.clients:
                try:
                    logger.info("Running latency test...")
                    response=internal_service_monitor.run_latency_test()
                    logger.info(f"Latency test complete: {response}")
                    await client.send_json(response)
                except WebSocketDisconnect:
                    disconnected_clients.append(client)     
            async with self.lock:
                for client in disconnected_clients:
                        self.clients.remove(client)

    async def send_logs(self, cloud_logger: CloudLogger):
        while self.clients:
            await asyncio.sleep(10)
            disconnected_clients=[]
            for client in self.clients:
                try:
                    logger.info("Fetching logs...")
                    logs=cloud_logger.get_project_logs(minutes_ago=1)
                    new_logs = []
                    for log in logs:
                        ts = datetime.fromisoformat(log["timestamp"].replace("Z", "+00:00"))
                        if not self.last_log_time or ts > self.last_log_time:
                            new_logs.append(log)
                    if new_logs:
                        self.last_log_time = max(datetime.fromisoformat(log["timestamp"].replace("Z", "+00:00")) for log in new_logs)
                        logger.info(f"Sending {len(new_logs)} new logs.")
                        await client.send_json(new_logs)
                    else:
                        logger.info("No new logs to send.")
                    logger.info(f"Logs fetched: {logs}")
                    await client.send_json(logs)
                except WebSocketDisconnect:
                    disconnected_clients.append(client)     
            async with self.lock:
                for client in disconnected_clients:
                        self.clients.remove(client)
    
    async def send_collection_changes(self, db_service: BaseDatabaseService, collection_name: str):
        await db_service.init_collection()
        pipeline = [{'$match': {'operationType': 'insert'}}]
        try:
           async with db_service.collection.watch(pipeline) as stream:
                async for change in stream:
                    logger.info(f"Change detected in {collection_name}: {change}")
                    change["fullDocument"]["description"]= get_db_change_description(collection_name, change["fullDocument"])
                    disconnected_clients=[]
                    for client in self.clients:
                        try:
                            await client.send_json(
                                {
                                    "operation_type":"insert", 
                                    "collection": collection_name,
                                    "data": convert_objectid(change["fullDocument"]),
                                }
                            )
                        except WebSocketDisconnect:
                            disconnected_clients.append(client)
                    async with self.lock:
                        for client in disconnected_clients:
                                self.clients.remove(client)
        except Exception as e:
            logger.error(f"Error watching collection: {e}")



