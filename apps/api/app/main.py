from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_connection import alix_ops_db_connection, control_room_db_connection
from app.routes import monitoring, platform, service_status, auth
from app.services.websocket_manager import WebsocketManager
from app.core.internal_service_monitor import InternalServiceMonitor
import asyncio

async def lifespan(app: FastAPI):
    await alix_ops_db_connection.connect()
    await control_room_db_connection.connect()
    yield
    await alix_ops_db_connection.close()
    await control_room_db_connection.close()


status_websocket_manager=WebsocketManager()
latency_websocket_manager=WebsocketManager()
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

@app.websocket("/status/ws")
async def websocket_service_status_endpoint(websocket: WebSocket, internal_service_monitor: InternalServiceMonitor=Depends()):
    """Handles WebSocket connections from clients"""
    print("Status websocket connected")
    await status_websocket_manager.connect(websocket)
    await asyncio.create_task(status_websocket_manager.send_monitoring_data(internal_service_monitor))
    try: 
        while True:
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        await status_websocket_manager.disconnect(websocket)

@app.websocket("/latency/ws")
async def websocket_latency_test_endpoint(websocket: WebSocket, internal_service_monitor: InternalServiceMonitor=Depends()):
    """Handles WebSocket connections from clients"""
    await latency_websocket_manager.connect(websocket)
    if len(latency_websocket_manager.clients)==1:
        await asyncio.create_task(latency_websocket_manager.send_latency_test_data(internal_service_monitor))
    try: 
        while True:
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        await latency_websocket_manager.disconnect(websocket)

app.include_router(service_status.router)
app.include_router(platform.router)
app.include_router(auth.router)
app.include_router(monitoring.router)
