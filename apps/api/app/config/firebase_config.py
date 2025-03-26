import firebase_admin
import os
from firebase_admin import credentials, auth
from dotenv import load_dotenv
from app.utils.logger import logger
load_dotenv()

current_dir = os.path.dirname(os.path.abspath(__file__))
whatsapp_control_room_service_account_keyfile_path = os.path.join(current_dir, "whatsapp-control-room-firebase-service-account-keyfile.json")
alix_ops_service_account_keyfile_path = os.path.join(current_dir, "alix-ops-firebase-service-account-keyfile.json")

whatsapp_control_room_cred = credentials.Certificate(whatsapp_control_room_service_account_keyfile_path)
alix_ops_cred = credentials.Certificate(alix_ops_service_account_keyfile_path)

whatsapp_control_room_app=firebase_admin.initialize_app(credential=whatsapp_control_room_cred, name="whatsapp-control-room")
alix_ops_app=firebase_admin.initialize_app(credential=alix_ops_cred, name="alix-ops")

whatsapp_control_room_auth=auth.Client(app=whatsapp_control_room_app)
alix_ops_auth=auth.Client(app=alix_ops_app)

