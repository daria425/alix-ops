
from app.db.db_service import HealthCheckLogsDatabaseService
from app.utils.logger import logger
import requests, time

INTERNAL_SERVICE_MONITORING_URL_LIST=["https://webhook-dot-ai-signposting.nw.r.appspot.com/", "https://ai-signposting.nw.r.appspot.com/", "https://ai-api-dot-ai-signposting.nw.r.appspot.com/", "https://whatsapp-control-room.ew.r.appspot.com/"]
WHATSAPP_SERVICE_URLS=["https://webhook-dot-ai-signposting.nw.r.appspot.com/", "https://ai-signposting.nw.r.appspot.com/", "https://ai-api-dot-ai-signposting.nw.r.appspot.com/"]
class InternalServiceMonitor:
    def __init__(self, test_phone_number:str=None):
        self.service_url_list=INTERNAL_SERVICE_MONITORING_URL_LIST
        self.whatsapp_service_url_list=WHATSAPP_SERVICE_URLS
        self.latency_check_request_body={
    "SmsMessageSid": "",
    "NumMedia": "0",
    "ProfileName": "Daria Naumova",
    "MessageType": "text",
    "SmsSid": "",
    "WaId": "38269372208",
    "SmsStatus": "received",
    "Body": "latency",
    "To": f"whatsapp:+{test_phone_number}" if test_phone_number else f"whatsapp:+447462582640",
    "MessagingServiceSid": "",
    "NumSegments": "1",
    "ReferralNumMedia": "0",
    "MessageSid": "",
    "AccountSid": "",
    "From": "whatsapp:+38269372208",
    "ApiVersion": "2010-04-01",
        }

    @staticmethod
    def get_friendly_name(service_url):
        if "webhook" in service_url:
            return "WhatsApp Webhook API"
        elif "ai-signposting" in service_url and "ai-api" not in service_url:
            return "WhatsApp Flows API"
        elif "ai-api" in service_url:
            return "WhatsApp AI API"
        elif "whatsapp-control-room" in service_url:
            return "Platform API"
        else:
            return "Unknown Service"
    
    @staticmethod
    def _ping_services(service_url_list):
        TIMEOUT = 10
        service_url_responses = {'service_responses':[]}
        for service_url in service_url_list:
            try:
                path = "health"
                start_time = time.time()  # Use time.time() consistently
                service_response = requests.get(f"{service_url}{path}", timeout=TIMEOUT)
                response_time = round(
                    time.time() - start_time, 2
                )  # Use time.time() here too

                service_response.raise_for_status()
                status_code = service_response.status_code
                message = f"Service at {service_url} is up: {status_code}"
                service_data = service_response.json()

                service_url_responses['service_responses'].append({
                    "friendly_name": InternalServiceMonitor.get_friendly_name(service_url),
                    "url":service_url,
                    "message": message,
                    "data": service_data,
                    "status_code": status_code,
                    "response_time": response_time,
                    "error": False,
                })
            except requests.exceptions.Timeout:
                response_time = round(time.time() - start_time, 2)
                service_url_responses['service_responses'].append({
                    "friendly_name": InternalServiceMonitor.get_friendly_name(service_url),
                    "url":service_url,
                    "message": f"Timeout error for {service_url} (took too long to respond)",
                    "data": None,
                    "status_code": 408,
                    "response_time": response_time,
                    "error": True,
                })

            except requests.exceptions.ConnectionError:
                response_time = round(time.time() - start_time, 2)
                service_url_responses['service_responses'].append({
                    "friendly_name": InternalServiceMonitor.get_friendly_name(service_url),
                    "url":service_url,
                    "message": f"Connection error for {service_url} (service may be down)",
                    "data": None,
                    "status_code": 503,
                    "response_time": response_time,
                    "error": True,
                })

            except requests.exceptions.HTTPError as e:
                response_time = round(time.time() - start_time, 2)
                service_url_responses['service_responses'].append({
                    "friendly_name": InternalServiceMonitor.get_friendly_name(service_url),
                    "url":service_url,
                    "message": f"HTTP error for {service_url}: {e}",
                    "data": None,
                    "status_code": 500,
                    "response_time": response_time,
                    "error": True,
                })

            except Exception as e:
                response_time = round(time.time() - start_time, 2)
                service_url_responses['service_responses'].append({
                    "friendly_name": InternalServiceMonitor.get_friendly_name(service_url),
                    "url":service_url,
                    "message": f"Unexpected error for {service_url}: {e}",
                    "data": None,
                    "status_code": 500,
                    "response_time": response_time,
                    "error": True,
                })
        service_url_responses['completed_at']=time.time()
        return service_url_responses
    def run_latency_test(self):
        
        try:
            ping_statuses=[]
            for service_url in self.whatsapp_service_url_list:
                ping_status=requests.get(f"{service_url}health", timeout=30)
                ping_status.raise_for_status()
                ping_statuses.append(ping_status.status_code)
            if any(status != 200 for status in ping_statuses):
                return{
                    "message": "One or more WhatsApp services are down, cannot proceed with latency test",
                    "status_code": 503,
                    "response_time": None,
                    "error": True,
                    "data": None,
                }
            logger.info("WhatsApp Services are up, proceeding with latency test...")
            time.sleep(3)  # Wait for 3 seconds before sending the latency test request
            start_time = time.time()
            response = requests.post(
                "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook",
                json=self.latency_check_request_body,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = round((time.time() - start_time) * 1000, 2)  # Convert to ms and round
            response.raise_for_status()
            status_code = response.status_code
            message = f"Latency test completed successfully with response time of {response_time} milliseconds"
            response_data = response.json()
            return {
                "message": message,
                "status_code": status_code,
                "response_time": response_time,
                "error": False,
                "url": "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook",
                "data": response_data,
            }
        except requests.exceptions.Timeout:
            response_time = round((time.time() - start_time) * 1000, 2)  # Convert to ms
            return {
                "message": "Timeout error during latency test (took too long to respond)",
                "status_code": 408,
                "response_time": response_time,
                "error": True,
                "url": "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook",
                "data": None,
            }
        except requests.exceptions.ConnectionError:
            response_time = round((time.time() - start_time) * 1000, 2)  # Convert to ms
            return {
                "message": "Connection error during latency test (service may be down)",
                "status_code": 503,
                "response_time": response_time,
                "error": True,
                "url": "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook",
                "data": None,
            }
        except requests.exceptions.HTTPError as e:
            response_time = round((time.time() - start_time) * 1000, 2)  # Convert to ms
            return {
                "message": f"HTTP error during latency test: {e}",
                "status_code": response.status_code if 'response' in locals() else 500,
                "response_time": response_time,
                "error": True,
                "url": "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook",
                "data": None,
            }
        except Exception as e:
            response_time = round((time.time() - start_time) * 1000, 2)  # Convert to ms
            return {
                "message": f"Unexpected error during latency test: {e}",
                "status_code": 500,
                "response_time": response_time,
                "error": True,
                "url": "https://webhook-dot-ai-signposting.nw.r.appspot.com/webhook",
                "data": None,
            }
    async def log_internal_service_status(self, logs_db_service: HealthCheckLogsDatabaseService):
        service_url_responses=self._ping_services(self.service_url_list)
        await logs_db_service.insert_log_entry(service_url_responses)
        logger.info("Monitoring complete")

    def get_internal_service_responses(self):
        service_url_responses=self._ping_services(self.service_url_list)
        return service_url_responses

        


        
            









