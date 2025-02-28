from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_connection import db_connection
from app.routes import service_status
from app.utils.logger import logger
from app.services.websocket_manager import WebsocketManager
from app.core.internal_service_monitor import InternalServiceMonitor
import asyncio

async def lifespan(app: FastAPI):
    await db_connection.connect()
    yield
    await db_connection.close()

websocket_manager=WebsocketManager()
app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}

# async def broadcast():
#     global count
#     while clients:
#             await asyncio.sleep(5)
#             count +=1
#             disconnected_clients = []
#             for client in clients:
#                 try:
#                     logger.info(f"Sending update")
#                     await client.send_text(f"Service Status Update {count}")
#                 except WebSocketDisconnect:
#                     disconnected_clients.append(client)

#             async with lock:  # Remove disconnected clients safely
#                 for client in disconnected_clients:
#                     clients.remove(client)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, internal_service_monitor: InternalServiceMonitor=Depends()):
    """Handles WebSocket connections from clients"""
    await websocket_manager.connect(websocket)
    if len(websocket_manager.clients)==1:
        await asyncio.create_task(websocket_manager.send_monitoring_data(internal_service_monitor))
    try: 
        while True:
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)

app.include_router(service_status.router)
