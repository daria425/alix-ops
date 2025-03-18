import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from app.core.internal_service_monitor import InternalServiceMonitor
from app.db.db_service import ErrorDatabaseService
from app.utils.logger import logger
class WebsocketManager:
    def __init__(self):
        self.clients=set()
        self.lock=asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.clients.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            self.clients.discard(websocket)

    async def send_monitoring_data(self, internal_service_monitor: InternalServiceMonitor, error_db_service: ErrorDatabaseService):
        while self.clients:
            await asyncio.sleep(5)
            disconnected_clients=[]
            for client in self.clients:
                try:
                    logger.info("Pinging services...")
                    responses=internal_service_monitor.get_internal_service_responses()
                    logger.info(f"Responses recieved: {responses}")
                    error_data=await error_db_service.get_all_documents()
                    responses['error_data']=error_data
                    await client.send_json(responses)
                except WebSocketDisconnect:
                    disconnected_clients.append(client)
            async with self.lock:  # Remove disconnected clients safely
                for client in disconnected_clients:
                        self.clients.remove(client)
            


