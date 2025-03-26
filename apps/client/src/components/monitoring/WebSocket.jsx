import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect } from "react";
import Latency from "./Latency";
import StatusGrid from "./StatusGrid";
import StatusCard from "./StatusCard";
import StatusTable from "./StatusTable";
import ErrorTable from "./ErrorTable";
import ErrorCharts from "./ErrorCharts";

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

export default function WebSocket() {
  const { message: serviceStatusMessage } = useWebSocket(
    "ws://127.0.0.1:8000/status/ws"
  );
  const { message: latencyMessage } = useWebSocket(
    "ws://127.0.0.1:8000/latency/ws"
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
    <div>
      <Latency
        serviceResponses={service_responses}
        latencyResponse={latencyMessage}
      />
      <ErrorCharts errorChartData={error_data} />
      <StatusCard statusData={service_responses} />

      {/* <StatusGrid statusChartData={statusChartData} /> */}
    </div>
  );
}
