from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.cloud_monitor import CloudMonitor
from app.db.db_service import UptimeLogsDatabaseService, FlowHistoryDatabaseService

router=APIRouter(prefix='/monitoring')

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
    
@router.get("/overview")
async def get_monitoring_overview(cloud_monitor: CloudMonitor = Depends(), flow_history_db_service: FlowHistoryDatabaseService = Depends()):
    """
    Returns an overview of monitoring metrics including:
    - Total Errors (24h)
    - Success Rate
    - Avg Latency (ms)
    - Active Flows
    """
    MOCK_LATENCY_VALUE=200
    try:
        total_errors=cloud_monitor.get_all_errors(86400)
        total_uptime=cloud_monitor.calculate_total_uptime(86400)
        flows_executed=await flow_history_db_service.get_flows_by_timeframe(86400)
        data= {
            "total_errors": total_errors.get("total_count", 0),
            "total_uptime": total_uptime, 
            "average_latency": MOCK_LATENCY_VALUE,
            "flows_executed": flows_executed.get("total_count", 0)
        }

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/activity")
async def get_whatsapp_activity(cloud_monitor: CloudMonitor = Depends()):
    """Get total WhatsApp activity"""
    try:
        request_timeseries=cloud_monitor.get_request_timeseries(432000)
        error_timeseries=cloud_monitor.get_error_timeseries(432000)
        data={
            "request_timeseries": request_timeseries,
            "error_timeseries": error_timeseries
        }
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))