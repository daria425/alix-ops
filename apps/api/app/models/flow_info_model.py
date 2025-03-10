from pydantic import BaseModel, ConfigDict
class FlowInfo(BaseModel):
    model_config=ConfigDict(extra='allow')
    isSendable: bool
    flowName: str
    isSchedulable: bool
    isRegistration: bool
    isSurvey: bool
    trigger: dict