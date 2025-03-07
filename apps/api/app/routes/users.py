from fastapi import APIRouter, Depends, HTTPException
from app.models.user_model import UserModel
from app.db.db_service import OrganizationDatabaseService, UserDatabaseService
from app.core.user_management import register_user
router=APIRouter(prefix='/users')

@router.post('/register', status_code=201)
async def register_new_user(user: UserModel, organization_db_service: OrganizationDatabaseService=Depends(), user_db_service: UserDatabaseService=Depends()):
    try:
        await register_user(user, organization_db_service, user_db_service)
        return {"message":"User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register user: {e}")