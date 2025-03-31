from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.core.flow_testing import run_flow_test
router=APIRouter(prefix='/whatsapp')

@router.get("/tests/run")
def run_whatsapp_flow_test(test_env:str, phone_number:str, flow_name:str):
    """
    Run a test of a WhatsApp flow
    """
    try:
        result=run_flow_test(flow_name, test_env, phone_number)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
    