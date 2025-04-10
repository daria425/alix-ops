from datetime import datetime, timedelta
def fill_dates(sorted_data:dict):
        start_date = datetime.strptime(min(sorted_data.keys()), "%Y-%m-%d")
        end_date = datetime.strptime(max(sorted_data.keys()), "%Y-%m-%d")
        full_dates=[]
        current_date=start_date
        while current_date<=end_date:
            full_dates.append({
                  "date": current_date.strftime("%Y-%m-%d"),
                  "value":sorted_data.get(current_date.strftime("%Y-%m-%d"), 0)
            })
            current_date+=timedelta(days=1)
        return full_dates


def convert_timestamp(timestamp, format="%d%-%m-%Y"):
    """Convert a timestamp to a human-readable format."""
    timestamp=datetime.fromisoformat(timestamp)
    return timestamp.strftime(format)