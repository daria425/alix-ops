from fastapi import APIRouter, Depends, HTTPException
from app.models.user_model import UserModel
from app.db.db_service import OrganizationDatabaseService, UserDatabaseService
from app.services.email_service import temp_email_service_instance, EmailService
from app.core.user_management import register_user_in_db, delete_user_in_db
router=APIRouter(prefix='/users')

def get_email_service_instance():
    return temp_email_service_instance


@router.post('/register', status_code=201)
async def register_user(user: UserModel, organization_db_service: OrganizationDatabaseService=Depends(), user_db_service: UserDatabaseService=Depends(), email_service: EmailService=Depends(get_email_service_instance)):
    try:
        await register_user_in_db(user, organization_db_service, user_db_service, email_service)
        return {"message":"User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register user: {e}")
    
@router.post('/delete', status_code=204)
async def delete_user(user: UserModel, organization_db_service: OrganizationDatabaseService=Depends(), user_db_service: UserDatabaseService=Depends()):
    try:
        await delete_user_in_db(user, organization_db_service, user_db_service)
        return {"message":"User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {e}")