from pydantic import BaseModel, Field
from datetime import datetime
class PlatformUserModel(BaseModel):
    email:str
    role:str
    organization_name:str
    CreatedAt:datetime
