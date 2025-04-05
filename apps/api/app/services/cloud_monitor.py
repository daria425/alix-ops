from google.cloud import monitoring_v3
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import os, time, json
from math import log10, floor
load_dotenv()
current_dir = os.path.dirname(os.path.abspath(__file__))
gcloud_projects_config_file_path=os.path.join(current_dir, "gcloud_projects_config.json")
with open(gcloud_projects_config_file_path, "r") as f:
    gcloud_projects_config=json.loads(f.read())
    MONITORING_PROJECT_ID=gcloud_projects_config[0].get("project_id")

class CloudMonitor:
    def __init__(self):
        self.client = monitoring_v3.MetricServiceClient()
        self.project_id = MONITORING_PROJECT_ID
        self.project_name = f"projects/{self.project_id}"

    def list_custom_metrics(self, metric_type:str):
        """Returns a list of user-defined custom metrics"""
        try:
            # List metric descriptors for custom metrics only
            request = monitoring_v3.ListMetricDescriptorsRequest(
                name=self.project_name,
                filter='metric.type = starts_with("logging.googleapis.com/user/")'
            
            )
            response = self.client.list_metric_descriptors(request=request)
            custom_metrics = []
            for metric in response:
                metric_name = metric.type.split('logging.googleapis.com/user/')[-1]
                if metric_type=="log":
                    if "error" not in metric_name and "health" not in metric_name and "latency" not in metric_name:
                        custom_metrics.append({
                            "name": metric_name, 
                            "display_name": metric.display_name,
                            "description": metric.description
                        })
                elif metric_type=="error":
                    if "error" in metric_name:
                        custom_metrics.append({
                            "name": metric_name, 
                            "display_name": metric.display_name,
                            "description": metric.description
                        })
            return custom_metrics
        except Exception as e:
            print(f"Error fetching custom metrics: {e}")
            return []

    def get_metric_count(self, timeframe: int, metric_name: str):
        """Get count for the specified metric in the given timeframe."""
        end_time = time.time()
        start_time = end_time - timeframe
        interval = monitoring_v3.TimeInterval(
            {"start_time": {"seconds": int(start_time)}, "end_time": {"seconds": int(end_time)}}
        )
        filter_str = f'metric.type="logging.googleapis.com/user/{metric_name}"'

        try:
            results = self.client.list_time_series(
                request={
                    "name": self.project_name,
                    "filter": filter_str,
                    "interval": interval,
                    "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                }
            )
            total_count = sum(point.value.int64_value for result in results for point in result.points)
            print(f"Total count for {metric_name}: {total_count}")
            return total_count
        except Exception as e:
            print(f"Error fetching metric count: {e}")
            return 0
        
    def get_all_requests(self, timeframe: int):
        """Get all requests in the given timeframe"""
        metric_names=["webhook-log", "all-llm-log", "all-flow-log"]
        end_time = time.time()
        start_time = end_time - timeframe
        interval = monitoring_v3.TimeInterval(
            {"start_time": {"seconds": int(start_time)}, "end_time": {"seconds": int(end_time)}}
        )
        metric_log_count=[]
        total_count=0
        for metric_name in metric_names:
            filter_str = f'metric.type="logging.googleapis.com/user/{metric_name}"'

            try:
                results = self.client.list_time_series(
                    request={
                        "name": self.project_name,
                        "filter": filter_str,
                        "interval": interval,
                        "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                    }
                )
                metric_count = sum(point.value.int64_value for result in results for point in result.points)
                item={
                    "name": metric_name,
                    "count": metric_count
                }
                metric_log_count.append(item)
                total_count+=metric_count
            except Exception as e:
                print(f"Error fetching request count: {e}")
                return 0
        print(f"Total count for all requests: {total_count}")
        return {
            "total_count": total_count,
            "metric_log_count": metric_log_count
        }
    
    def get_all_errors(self, timeframe:int):
        """Get all errors in the given timeframe"""
        metric_names=["webhook-log-error", "all-llm-error", "all-flow-error", "total-error",]
        end_time = time.time()
        start_time = end_time - timeframe
        interval = monitoring_v3.TimeInterval(
            {"start_time": {"seconds": int(start_time)}, "end_time": {"seconds": int(end_time)}}
        )
        total_count=0
        metric_log_count=[]
        for metric_name in metric_names:
            filter_str = f'metric.type="logging.googleapis.com/user/{metric_name}"'

            try:
                results = self.client.list_time_series(
                    request={
                        "name": self.project_name,
                        "filter": filter_str,
                        "interval": interval,
                        "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                    }
                )
                metric_count = sum(point.value.int64_value for result in results for point in result.points)
                item={
                    "name": metric_name,
                    "count": metric_count
                }
                metric_log_count.append(item)
                total_count+=metric_count
            except Exception as e:
                print(f"Error fetching error count: {e}")
                return 0
        print(f"Total count for all errors: {total_count}")

        return {
            "total_count": total_count,
            "metric_log_count": metric_log_count
        }
    
    def get_request_timeseries(self, timeframe:int):
        """Get all requests in the given timeframe, and return a dict with timestamp as key and count as value."""
        metric_names = ["webhook-log", "all-llm-log", "all-flow-log"]
        end_time = time.time()
        start_time = end_time - timeframe
        interval = monitoring_v3.TimeInterval(
            {"start_time": {"seconds": int(start_time)}, "end_time": {"seconds": int(end_time)}}
        )
        request_data = {}

        # Initialize all dates with 0 counts
        current_date = datetime.fromtimestamp(start_time, timezone.utc).date()
        end_date = datetime.fromtimestamp(end_time, timezone.utc).date()
        while current_date <= end_date:
            request_data[current_date.isoformat()] = {"total_count":0, "metrics": {metric_name: 0 for metric_name in metric_names}}
            current_date += timedelta(days=1)

        for metric_name in metric_names:
            filter_str = f'metric.type="logging.googleapis.com/user/{metric_name}"'

            try:
                results = self.client.list_time_series(
                    request={
                        "name": self.project_name,
                        "filter": filter_str,
                        "interval": interval,
                        "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                    }
                )
                for result in results:
                    for point in result.points:
                        timestamp = datetime.fromtimestamp(point.interval.start_time.timestamp(), timezone.utc)
                        date_key = timestamp.date().isoformat()
                        count = point.value.int64_value
                        request_data[date_key]["metrics"][metric_name] += count
                        request_data[date_key]["total_count"] += count

            except Exception as e:
                print(f"Error fetching request count: {e}")
                return {}
        return request_data
    
    def get_error_timeseries(self, timeframe:int):
        """Get all errors in the given timeframe, and return a dict with timestamp as key and count as value."""
        metric_names=["webhook-log-error", "all-llm-error", "all-flow-error"]
        end_time = time.time()
        start_time = end_time - timeframe
        interval = monitoring_v3.TimeInterval(
            {"start_time": {"seconds": int(start_time)}, "end_time": {"seconds": int(end_time)}}
        )
        request_data = {}
        current_date = datetime.fromtimestamp(start_time, timezone.utc).date()
        end_date = datetime.fromtimestamp(end_time, timezone.utc).date()
        while current_date <= end_date:
            request_data[current_date.isoformat()] = {
                "total_count": 0,
                "metrics": {metric_name: 0 for metric_name in metric_names}
            }
            current_date += timedelta(days=1)

        for metric_name in metric_names:
            filter_str = f'metric.type="logging.googleapis.com/user/{metric_name}"'

            try:
                results = self.client.list_time_series(
                    request={
                        "name": self.project_name,
                        "filter": filter_str,
                        "interval": interval,
                        "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                    }
                )
                for result in results:
                    for point in result.points:
                        timestamp = datetime.fromtimestamp(point.interval.start_time.timestamp(), timezone.utc)
                        date_key = timestamp.date().isoformat()
                        count = point.value.int64_value
                        request_data[date_key]["metrics"][metric_name] += count
                        request_data[date_key]["total_count"] += count

            except Exception as e:
                print(f"Error fetching request count: {e}")
                return {}
        return request_data
    
    
    def calculate_total_uptime(self, timeframe:int):
        """Calculate uptime percentage for the given timeframe"""
        error_data = self.get_all_errors(timeframe)
        request_data = self.get_all_requests(timeframe)
        total_requests = request_data["total_count"]
        total_errors = error_data["total_count"]
        
        if total_requests == 0:
            print("No requests found in the given timeframe, assuming 100% uptime")
            return 100.0
        
        if total_errors > total_requests:
            total_errors = total_requests
        
        uptime = (total_requests - total_errors) / total_requests * 100
        
        # Round to 2 significant figures safely
        if uptime == 0:
            rounded_uptime = 0.0
        else:
            if uptime >= 100:
                rounded_uptime = 100.0
            else:
                # Determine scale based on order of magnitude
                magnitude = floor(log10(abs(uptime)))
                scale = 10 ** (magnitude - 1)
                rounded_uptime = round(uptime / scale) * scale
        
        print(f"Uptime: {rounded_uptime:.2f}% (Requests: {total_requests}, Errors: {total_errors})")
        return rounded_uptime

