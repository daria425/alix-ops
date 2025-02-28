from fastapi import APIRouter, Depends
import asyncio, os, json
from dotenv import load_dotenv
from app.db.db_service import LogsDatabaseService
from app.core.internal_service_monitor import log_internal_service_status
load_dotenv()
INTERNAL_SERVICE_MONITORING_URL_LIST = json.loads(
    os.environ.get("INTERNAL_SERVICE_MONITORING_URL_LIST", "[]")
)
router=APIRouter(prefix='/service-status')

@router.get('/log', status_code=201)
async def log_service_status(type:str, logs_db_service:LogsDatabaseService=Depends()):
    if type=='internal':
        await log_internal_service_status(service_url_list=INTERNAL_SERVICE_MONITORING_URL_LIST, logs_db_service=logs_db_service)





# async def main():
#     await db_connection.connect()
#     db_service=LogsDatabaseService()
#     await monitor(INTERNAL_SERVICE_MONITORING_URL_LIST, db_service)
#     await db_connection.close()

# if __name__=='__main__':
#     asyncio.run(main())

