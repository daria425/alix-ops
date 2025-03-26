from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.cloud_monitor import CloudMonitor
from app.db.db_service import UptimeLogsDatabaseService

router=APIRouter(prefix='/whatsapp-metrics')

@router.get("/uptime/total")
async def get_total_uptime(request: Request, timeframe:int, cloud_monitor: CloudMonitor = Depends(), db_service: UptimeLogsDatabaseService = Depends()):
    """Get total uptime for WhatsApp services"""
    try:
        data=cloud_monitor.calculate_total_uptime(timeframe)
        if "X-Cron-Job" in request.headers:
            await db_service.insert_log_entry(data)
        data.pop("_id", None)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
