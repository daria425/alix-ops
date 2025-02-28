from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_connection import db_connection
from app.routes import service_status
from app.utils.logger import logger
import asyncio

async def lifespan(app: FastAPI):
    await db_connection.connect()
    yield
    await db_connection.close()

app = FastAPI(lifespan=lifespan)

# Use a set instead of a list for WebSocket clients
clients = set()
lock = asyncio.Lock()  # Prevent multiple threads modifying `clients` at once
count=0
# CORS configuration
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

async def broadcast():
    global count
    while clients:
            await asyncio.sleep(5)
            count +=1
            disconnected_clients = []
            for client in clients:
                try:
                    logger.info(f"Sending update {count} 🚀")
                    await client.send_text(f"Service Status Update {count}")
                except WebSocketDisconnect:
                    disconnected_clients.append(client)

            async with lock:  # Remove disconnected clients safely
                for client in disconnected_clients:
                    clients.remove(client)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handles WebSocket connections from clients"""
    await websocket.accept()

    async with lock:  
        clients.add(websocket)
    if len(clients)==1:
        await asyncio.create_task(broadcast())
    try: 
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        async with lock:
            clients.discard(websocket) 

app.include_router(service_status.router)
