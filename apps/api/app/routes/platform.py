from fastapi import APIRouter, Depends, HTTPException
from app.models.platform_user_model import PlatformUserModel
from app.models.flow_info_model import FlowInfo
from app.db.db_service import OrganizationDatabaseService, UserDatabaseService, FlowDatabaseService
from app.services.email_service import temp_email_service_instance, EmailService
from app.core.user_management import register_user_in_db, delete_user_in_db
from app.core.flow_management import create_flow_in_db
router=APIRouter(prefix='/platform')

def get_email_service_instance():
    return temp_email_service_instance

@router.get("")
async def get_platform_data(org_db_service: OrganizationDatabaseService=Depends(), flow_db_service: FlowDatabaseService=Depends(), user_db_service: UserDatabaseService=Depends()):
    try:
        organizations=await org_db_service.get_all_documents()
        users=await user_db_service.get_all_documents()
        flows=await flow_db_service.get_all_documents()
        return {"organizations":organizations, "users":users, "flows":flows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve platform data: {e}")

@router.post('/users/register', status_code=201)
async def register_user(user: PlatformUserModel, organization_db_service: OrganizationDatabaseService=Depends(), user_db_service: UserDatabaseService=Depends(), email_service: EmailService=Depends(get_email_service_instance)):
    try:
        await register_user_in_db(user, organization_db_service, user_db_service, email_service)
        return {"message":"User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register user: {e}")
    
@router.post('/users/delete', status_code=204)
async def delete_user(user: PlatformUserModel, organization_db_service: OrganizationDatabaseService=Depends(), user_db_service: UserDatabaseService=Depends()):
    try:
        await delete_user_in_db(user, organization_db_service, user_db_service)
        return {"message":"User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {e}")
    
@router.post("/flows/create", status_code=201)
async def create_flow(organization_id: str, flow_info: FlowInfo, organization_db_service: OrganizationDatabaseService=Depends(), flows_db_service: FlowDatabaseService=Depends()):
    try:
        await create_flow_in_db(organization_id, organization_db_service, flows_db_service, flow_info)
        return {"message":"Flow created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create flow: {e}")
