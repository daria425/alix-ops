import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect, useMemo } from "react";
import Services from "./Services";
import StatusGrid from "./StatusGrid";

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

export default function Websocket() {
  const { message } = useWebSocket("ws://127.0.0.1:8000/ws");
  const serviceResponses = useMemo(
    () => message?.service_responses || [],
    [message]
  );
  const [serviceStatusHistory, setServiceStatusHistory] = useState([]);
  useEffect(() => {
    if (serviceResponses.length > 0) {
      setServiceStatusHistory((prevHistory) => {
        const updatedHistory = serviceResponses.map((serviceResponse) => ({
          friendly_name: serviceResponse.friendly_name,
          status: {
            value: serviceResponse.status_code,
            date: serviceResponse.data.timestamp, //TO-DO: check wtf is going on here
          },
        }));

        return [...prevHistory, ...updatedHistory].slice(-50);
      });
    }
  }, [serviceResponses]);

  const statusChartData = transformData(serviceStatusHistory);
  return (
    <div>
      <Services serviceResponses={serviceResponses} />
      <StatusGrid statusChartData={statusChartData} />
    </div>
  );
}
