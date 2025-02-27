from dotenv import load_dotenv
from typing import List
import requests, os, json
load_dotenv()
INTERNAL_SERVICE_MONITORING_URL_LIST=json.loads(os.environ.get('INTERNAL_SERVICE_MONITORING_URL_LIST', '[]'))

def ping_service(service_url_list:List[str]):
    TIMEOUT=10
    service_url_responses={}
    for service_url in service_url_list:
        try:
            path="health"
            service_response=requests.get(f"{service_url}{path}", timeout=TIMEOUT)
            service_response.raise_for_status()
            status_code=service_response.status_code
            message=f"Service at {service_url} is up: {service_response.status_code}"
            service_response=service_response.json()
            service_url_responses[service_url]= {
                "message": message, "data": service_response, "status_code":status_code
            }
        except requests.exceptions.Timeout:
            message = f"Timeout error for {service_url} (took too long to respond)"
            service_url_responses[service_url] = {"message": message, "data": None, "status_code": 408}

        except requests.exceptions.ConnectionError:
            message = f"Connection error for {service_url} (service may be down)"
            service_url_responses[service_url] = {"message": message, "data": None, "status_code":503}

        except requests.exceptions.HTTPError as e:
            message = f"HTTP error for {service_url}: {e}"
            service_url_responses[service_url] = {"message": message, "data": None, "status_code":500}

        except Exception as e:
            message = f"Unexpected error for {service_url}: {e}"
            service_url_responses[service_url] = {"message": message, "data": None, "status_code":500}
    return service_url_responses

service_url_responses=ping_service(INTERNAL_SERVICE_MONITORING_URL_LIST)
print(service_url_responses)