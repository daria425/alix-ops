from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.cloud_monitor import CloudMonitor
from app.db.db_service import UptimeLogsDatabaseService, FlowHistoryDatabaseService, ErrorDatabaseService, MessageDatabaseService, LatencyTestLogDatabaseService
from app.core.internal_service_monitor import InternalServiceMonitor
from app.utils.format import get_db_change_description, get_friendly_flow_name
from app.utils.logger import logger
import os, json

router=APIRouter(prefix='/monitoring')

@router.get("/uptime/total")
async def get_total_uptime(request: Request, timeframe:int, cloud_monitor: CloudMonitor = Depends(), db_service: UptimeLogsDatabaseService = Depends()):
    """Get total uptime for WhatsApp services"""
    try:
        data=cloud_monitor.calculate_total_uptime(timeframe)
        if "X-Cron-Job" in request.headers:
            await db_service.insert_log_entry(data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/latency", status_code=201)
async def test_latency(internal_service_monitor: InternalServiceMonitor = Depends(), latency_logs_db_service: LatencyTestLogDatabaseService = Depends()) :
    """Test latency of WhatsApp Message (Twilio API)"""
    try:
        response=internal_service_monitor.run_latency_test()
        await latency_logs_db_service.insert_log_entry(response)
        if response["error"]:
            message=f"Latency test failed with error {response['status_code']}"
        else:
            message=f"Latency test successful with response code {response['status_code']}"
        return {
            "message": message,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/overview")
async def get_monitoring_overview(cloud_monitor: CloudMonitor = Depends(), flow_history_db_service: FlowHistoryDatabaseService = Depends(), latency_logs_db_service: LatencyTestLogDatabaseService = Depends()):
    """
    Returns an overview of monitoring metrics including:
    - Total Errors (24h)
    - Success Rate
    - Avg Latency (ms)
    - Active Flows
    """
    TIMEFRAME=86400  # 24 hours in seconds
    try:
        total_errors=cloud_monitor.get_all_errors(TIMEFRAME)
        total_uptime=cloud_monitor.calculate_total_uptime(TIMEFRAME)
        flows_executed=await flow_history_db_service.get_flows_by_timeframe(TIMEFRAME)
        average_latency=await latency_logs_db_service.calculate_average_latency(TIMEFRAME)
        data= {
            "total_errors": total_errors.get("total_count", 0),
            "total_uptime": total_uptime, 
            "average_latency": average_latency,
            "flows_executed": flows_executed.get("total_count", 0)
        }

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/api/activity")
async def get_api_activity(cloud_monitor: CloudMonitor = Depends()):
    """Get total WhatsApp API activity"""
    try:
        request_timeseries=cloud_monitor.get_request_timeseries(604800)
        error_timeseries=cloud_monitor.get_error_timeseries(604800)
        data={
            "request_timeseries": request_timeseries,
            "error_timeseries": error_timeseries
        }
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/whatsapp/activity")
async def get_whatsapp_activity(timeframe:int=86400, flow_history_db_service: FlowHistoryDatabaseService=Depends(), message_db_service: MessageDatabaseService=Depends()):
    """Get total WhatsApp activity"""
    try:
        flows=await flow_history_db_service.get_flows_by_timeframe(timeframe)
        messages=await message_db_service.get_documents_by_timeframe(timeframe)
        flows_with_description = [
            {**flow, "description": get_db_change_description("flow_history", flow), "friendly_name": get_friendly_flow_name(flow.get("flowName"))}
            for flow in flows["documents"]
        ]
        
        # Add description to each message document
        messages_with_description = [
            {**message, "description": get_db_change_description("messages", message)}
            for message in messages["documents"]
        ]
        documents=flows_with_description+messages_with_description
        # Sort documents by timestamp in descending order
        documents.sort(key=lambda x: x.get("CreatedAt", 0), reverse=True)
        return {
        "documents": documents,
        "total_count": len(documents),  
        }

        
            
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/whatsapp/errors")
async def get_whatsapp_errors(error_db_service: ErrorDatabaseService=Depends()):
    """Get total WhatsApp errors"""
    try:
        sort_config={
            "field":"timestamp", 
            "reverse":True
        }
        errors=await error_db_service.get_all_documents(sort_config=sort_config)
        return errors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
