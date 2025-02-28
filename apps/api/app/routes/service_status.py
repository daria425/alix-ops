from fastapi import APIRouter, Depends
import asyncio, os, json
from dotenv import load_dotenv
from app.db.db_service import LogsDatabaseService
from app.core.internal_service_monitor import InternalServiceMonitor
load_dotenv()
INTERNAL_SERVICE_MONITORING_URL_LIST = json.loads(
    os.environ.get("INTERNAL_SERVICE_MONITORING_URL_LIST", "[]")
)


router=APIRouter(prefix='/service-status')

@router.get('/log', status_code=201)
async def log_service_status(type:str, internal_service_monitor:InternalServiceMonitor=Depends(),logs_db_service:LogsDatabaseService=Depends()):
    if type=='internal':
        await internal_service_monitor.log_internal_service_status(logs_db_service=logs_db_service)
