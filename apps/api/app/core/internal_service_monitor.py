
from app.db.db_service import LogsDatabaseService
from app.utils.logger import logger
import requests, time

INTERNAL_SERVICE_MONITORING_URL_LIST=["https://webhook-dot-ai-signposting.nw.r.appspot.com/", "https://ai-signposting.nw.r.appspot.com/", "https://ai-signposting.nw.r.appspot.com/", "https://whatsapp-control-room.ew.r.appspot.com/"]
class InternalServiceMonitor:
    def __init__(self):
        self.service_url_list=INTERNAL_SERVICE_MONITORING_URL_LIST
    
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
                    "url":service_url,
                    "message": f"Unexpected error for {service_url}: {e}",
                    "data": None,
                    "status_code": 500,
                    "response_time": response_time,
                    "error": True,
                })
        service_url_responses['completed_at']=time.time()
        return service_url_responses
    
    async def log_internal_service_status(self, logs_db_service: LogsDatabaseService):
        service_url_responses=self._ping_services(self.service_url_list)
        await logs_db_service.insert_log_entry(service_url_responses)
        logger.info("Monitoring complete")

    def get_internal_service_responses(self):
        service_url_responses=self._ping_services(self.service_url_list)
        return service_url_responses

        


        
            









