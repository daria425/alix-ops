import { LoadingState, ErrorState } from "../common/FetchStates";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import { CustomBarChart } from "../common/CustomCharts";

//eslint-disable-next-line
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

export default function ServiceMetrics() {
  const { message: serviceStatusMessage } = useWebSocket(
    "ws://127.0.0.1:8000/status/ws"
  );
  const { service_responses = [] } = serviceStatusMessage || {};
  //eslint-disable-next-line
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

  // const statusChartData = transformData(serviceStatusHistory);
  const isMobile = useMediaQuery("(max-width:768px)");

  const metricStyle = isMobile
    ? { flexDirection: "column" }
    : { flexDirection: "row" };
  return (
    <Card sx={{ minWidth: "300px", flexGrow: 1 }}>
      <CardContent>
        <MainCardHeading title="SERVICE LATENCY" />
        {service_responses.length > 0 ? (
          <CustomBarChart
            dataset={service_responses.map(
              ({ friendly_name, response_time }) => ({
                label: friendly_name,
                value: response_time,
              })
            )}
            chartProps={{ height: 300 }}
            seriesProps={{}}
            xAxisProps={{}}
          />
        ) : (
          <LoadingState />
        )}
      </CardContent>
    </Card>
  );
}
