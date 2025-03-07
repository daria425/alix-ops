import firebase_admin
import os
from firebase_admin import credentials
from dotenv import load_dotenv
from app.utils.logger import logger
load_dotenv()
service_account_keyfile_path=os.getenv("FIREBASE_SERVICE_ACCOUNT_KEYFILE_PATH")
cred = credentials.Certificate(service_account_keyfile_path)

def init_firebase():
    firebase_admin.initialize_app(cred)
    logger.info("Firebase initialized 🔥")
