import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect } from "react";
import Services from "./Services";
import StatusGrid from "./StatusGrid";
import Errors from "./Errors";

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

export default function Websocket() {
  const { message } = useWebSocket("ws://127.0.0.1:8000/status/ws");
  const { service_responses = [], error_data = {} } = message || {};
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
  return (
    <div>
      <Errors errors={error_data} />
      <Services serviceResponses={service_responses} />
      <StatusGrid statusChartData={statusChartData} />
    </div>
  );
}
