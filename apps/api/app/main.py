
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_connection import db_connection
from app.routes import service_status
import asyncio
async def lifespan(app: FastAPI):
    await db_connection.connect()
    yield
    await db_connection.close()

app=FastAPI(lifespan=lifespan)
clients=[]
origins=[
  "http://localhost:5173",
]

app.add_middleware(    
   CORSMiddleware,
   allow_origins=origins,
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],)

@app.get("/")
def root():
    return {
        "message": "Hello from FastAPI"
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await asyncio.sleep(1)
            for client in clients:
                await client.send_text("Service Status Update")
    except WebSocketDisconnect:
        clients.remove(websocket)
        
app.include_router(service_status.router)