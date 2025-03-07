
from firebase_admin import auth
from app.utils.logger import logger
from app.db.db_service import OrganizationDatabaseService, UserDatabaseService
from app.models.user_model import UserModel


def create_user_in_firebase(email:str, role: str):
    try:
        user = auth.create_user(
            email=email,
        )
        link=auth.generate_password_reset_link(email=email)
        logger.info(f"Link {link} sent to {email}")
        logger.info(f"Successfully created user: {user.uid} in Firebase")
        return{
            "email":email, "uid":user.uid, "role":role, 
        } # Save this to mongoDB bc we have the UID here
    except Exception as e:
        logger.error(f"Failed to create user: {e}")
        return None
    

def delete_user_in_firebase(uid:str):
    try:
        auth.delete_user(uid)
        logger.info(f"Successfully deleted user: {uid} from Firebase")
    except Exception as e:
        logger.error(f"Failed to delete user: {e}")
    
async def find_user_organization(organization_name: str, organization_db_service: OrganizationDatabaseService):
    organization_id = await organization_db_service.find_organization_id_by_name(organization_name)
    if organization_id:
        return organization_id
    else:
        logger.error(f"Organization {organization_name} not found")
        return None

async def register_user_in_db(user: UserModel,  organization_db_service: OrganizationDatabaseService, user_db_service: UserDatabaseService):
    email=user.email
    role=user.role
    organization_name=user.organization_name
    try: 
        organization_id=await find_user_organization(organization_name, organization_db_service)
        user_dict=create_user_in_firebase(email, role)
        user_dict["organizationId"]=organization_id
        await user_db_service.insert_user(user_dict)
        await organization_db_service.update_organization_with_uid(organization_id, user_dict["uid"])
        logger.info(f"Successfully registered user {email} to organization {organization_name}")

    except Exception as e:
        logger.error(f"Failed to register user: {e}")
        raise e
    
async def delete_user_in_db(user: UserModel, organization_db_service: OrganizationDatabaseService, user_db_service: UserDatabaseService):
    email=user.email
    organization_name=user.organization_name
    try:
        organization_id=await find_user_organization(organization_name, organization_db_service)
        user_dict=await user_db_service.find_user_by_email(email)
        if user_dict:
            delete_user_in_firebase(user_dict["uid"])
            await user_db_service.delete_user(user_dict["uid"])
            await organization_db_service.remove_uid_from_organization(organization_id, user_dict["uid"])
            logger.info(f"Successfully deleted user {email} from organization {organization_name}")
        else:
            logger.error(f"User {email} not found")
    except Exception as e:
        logger.error(f"Failed to delete user: {e}")
        raise e 
    




