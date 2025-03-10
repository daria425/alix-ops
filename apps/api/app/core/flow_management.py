from app.utils.logger import logger
from app.db.db_service import OrganizationDatabaseService, FlowDatabaseService
from bson.objectid import ObjectId 
from app.models.flow_info_model import FlowInfo
async def create_flow_in_db(organization_id: str, organization_db_service: OrganizationDatabaseService, flows_db_service: FlowDatabaseService, flow_info: FlowInfo):
    try:
        organization_id = ObjectId(organization_id) # Convert to ObjectId bc we recieve it in query params so is a string
        await organization_db_service.register_flow_for_organization(organization_id=organization_id, flow_trigger=flow_info.trigger)
        flow_dict = flow_info.model_dump(by_alias=True)
        flow_dict["organizationIds"] = [organization_id]
        flow_dict.pop("trigger", None)
        await flows_db_service.insert_flow(flow_dict)
        logger.info(f"Successfully created flow {flow_info.flowName} for organization {str(organization_id)}")
    except Exception as e:
        logger.error(f"Failed to create flow {flow_info.flowName} for organization {str(organization_id)}: {str(e)}")
        raise


