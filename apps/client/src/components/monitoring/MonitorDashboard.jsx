import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ServiceMetrics from "./ServiceMetrics";

const transformData = (data) => {
  const groupedData = {};

  data.forEach(({ friendly_name, status }) => {
    if (!groupedData[friendly_name]) {
      groupedData[friendly_name] = [];
    }
    groupedData[friendly_name].push(status);
  });

  return Object.entries(groupedData).map(([key, value]) => ({
    label: key,
    dataset: { [key]: value },
  }));
};

const hasValidData = (array) => {
  return array.every((item) => item?.data);
};

export default function MonitorDashboard() {
  const { message: serviceStatusMessage } = useWebSocket(
    "ws://127.0.0.1:8000/status/ws"
  );
  const { service_responses = [], error_data = {} } =
    serviceStatusMessage || {};
  const [serviceStatusHistory, setServiceStatusHistory] = useState([]);
  useEffect(() => {
    if (service_responses.length > 0 && hasValidData(service_responses)) {
      setServiceStatusHistory((prevHistory) => {
        const updatedHistory = service_responses.map((serviceResponse) => ({
          friendly_name: serviceResponse.friendly_name,
          status: {
            value: serviceResponse.status_code,
            date: serviceResponse.data.timestamp, //TO-DO: check wtf is going on here
          },
        }));

        return [...prevHistory, ...updatedHistory].slice(-50);
      });
    }
  }, [service_responses]);

  const statusChartData = transformData(serviceStatusHistory);
  //TO-DO: return loading wrapper if !message
  return (
    <Box>
      <ServiceMetrics serviceMetrics={service_responses} />
    </Box>
  );
}
