from google.cloud import logging_v2
from datetime import datetime, timedelta, timezone
from collections import OrderedDict
import json
class CloudLogger:
    def __init__(self):
        self.client=logging_v2.Client(project="ai-signposting")
    
    def get_project_logs(self, minutes_ago: int = 1):
        now = datetime.now(timezone.utc)
        since_time = now - timedelta(minutes=minutes_ago)

        filter_str = f"""
            timestamp >= "{since_time.strftime('%Y-%m-%dT%H:%M:%SZ')}"
            AND resource.type="gae_app"
        """

        entries = self.client.list_entries(
            filter_=filter_str,
            order_by=logging_v2.DESCENDING,
        )

        logs = []
        for entry in entries:
            if entry.http_request or entry.severity == 'ERROR':
                    if (isinstance(entry.payload, str) and entry.payload.startswith("{")):
                        try:
                            payload = json.loads(entry.payload)
                            message_type="dict"
                        except json.JSONDecodeError:
                            payload = entry.payload 
                            message_type="str"
                    elif isinstance(entry.payload, (dict, OrderedDict)):
                        payload = entry.payload
                        message_type="dict"
                    else:
                        payload = str(entry.payload)
                        message_type="str"
                    logs.append({
                        "timestamp": entry.timestamp.isoformat(),
                        "severity": entry.severity,
                        "message": payload,
                        "message_type": message_type,
                    })
        return logs

