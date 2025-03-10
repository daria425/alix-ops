from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from app.db.db_service import AlixOpsUserService
from app.auth.get_token_data import get_token_data

router=APIRouter(prefix='/auth')

@router.post('/login')
async def login_user(request: Request, user_db_service: AlixOpsUserService=Depends()):
    id_token = request.headers.get('Authorization')
    if not id_token:
        return JSONResponse({"message":"No token provided", "data": None}, status_code=401)
    id_token = id_token.split('Bearer ')[-1]
    user_data=get_token_data(id_token)
    logged_in_user=await user_db_service.login_user(user_data)
    return logged_in_user