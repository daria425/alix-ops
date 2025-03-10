from pydantic import BaseModel, Field

class PlatformUserModel(BaseModel):
    email:str
    role:str
    organization_name:str
