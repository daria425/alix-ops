import requests
import json
import os
import time
from datetime import datetime
from app.utils.logger import logger
def preload_test_messages():
    messages = {}
    directory = os.path.join(os.path.dirname(__file__), "test_messages")
    for filename in os.listdir(directory):
        if filename.endswith("_test_messages.json"):
            flow_name = filename.replace("_test_messages.json", "")
            with open(os.path.join(directory, filename), "r") as file:
                messages[flow_name] = json.load(file)
    return messages

def run_flow_test(flow_name:str, test_env:str, phone_number:str):
        api_url = (
        "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook"
        if test_env == "production"
        else "http://localhost:3000/webhook"
    )
        messages = preload_test_messages()
        test_messages=messages.get(flow_name)
        timestamp=datetime.now().timestamp()
        if not test_messages:
            return {"message": "Flow not found", "data": None}
        for message in test_messages:
                message["To"] =f'whatsapp:+{phone_number}'
                try:
                    response = requests.post(api_url, json=message, headers={"Content-Type": "application/json", "X-Test": "true"}, timeout=30)
                    response.raise_for_status()
                    logger.info(f"Message sent: {response.status_code}")
                except requests.RequestException as e:
                    logger.info(f"Error sending message: {e}")
                    return {"message": "Failed to send some messages", "error": str(e), "success": False, "timestamp": timestamp}  
                time.sleep(3)
                logger.info('Message sent, waiting 3 seconds...')
        return {"message": "All messages sent successfully", "error": None, "success": True, "timestamp": timestamp}