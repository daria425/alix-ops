from pydantic import BaseModel, ConfigDict
from datetime import datetime
class FlowInfo(BaseModel):
    model_config=ConfigDict(extra='allow')
    isSendable: bool
    flowName: str
    isSchedulable: bool
    isRegistration: bool
    isSurvey: bool
    trigger: dict
    CreatedAt: datetime