
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_connection import db_connection
from app.routes import service_status
async def lifespan(app: FastAPI):
    await db_connection.connect()
    yield
    await db_connection.close()

app=FastAPI(lifespan=lifespan)

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

app.include_router(service_status.router)