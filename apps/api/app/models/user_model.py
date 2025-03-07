from pydantic import BaseModel, Field

class UserModel(BaseModel):
    email:str
    role:str
    organization_name:str
