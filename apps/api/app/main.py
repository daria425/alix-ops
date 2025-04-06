from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_connection import alix_ops_db_connection, control_room_db_connection
from app.routes import monitoring, platform, service_status, auth, whatsapp
from app.services.websocket_manager import WebsocketManager
from app.db.db_service import FlowHistoryDatabaseService, MessageDatabaseService
import asyncio

async def lifespan(app: FastAPI):
    await alix_ops_db_connection.connect()
    await control_room_db_connection.connect()
    yield
    await alix_ops_db_connection.close()
    await control_room_db_connection.close()



db_websocket_manager=WebsocketManager()

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


@app.websocket("/db-stream/ws")
async def websocket_db_stream_endpoint(websocket: WebSocket, flow_history_db_service: FlowHistoryDatabaseService=Depends(), message_db_service: MessageDatabaseService=Depends()):
    """Handles WebSocket connections from clients"""
    await db_websocket_manager.connect(websocket)
    if len(db_websocket_manager.clients)==1:
        asyncio.create_task(db_websocket_manager.send_collection_changes(db_service=flow_history_db_service, collection_name="flow_history"))
        asyncio.create_task(db_websocket_manager.send_collection_changes(db_service=message_db_service, collection_name="messages"))
    try: 
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        await db_websocket_manager.disconnect(websocket)



app.include_router(service_status.router)
app.include_router(platform.router)
app.include_router(auth.router)
app.include_router(monitoring.router)
app.include_router(whatsapp.router)
