from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.utils.logger import logger
from dotenv import load_dotenv
import os
load_dotenv()
SENDGRID_API_KEY=os.getenv("SENDGRID_API_KEY")

class EmailService:
    def __init__(self, sender_email:str):
        self.sendgrid_client = SendGridAPIClient(api_key=SENDGRID_API_KEY)
        self.sender_email = sender_email
    def send_email(self, recipient_email:str, subject:str, body:str):
        from_email = self.sender_email
        to_email = recipient_email
        mail = Mail(from_email, to_emails=to_email, subject=subject, plain_text_content=body)
        try:
            response = self.sendgrid_client.send(mail)
            logger.info(f"Email sent to {to_email} with response code {response.status_code}")
        except Exception as e:
            raise RuntimeError(f"Failed to send email: {e}")


    