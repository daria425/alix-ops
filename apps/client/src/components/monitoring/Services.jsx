import { Card, CardContent } from "@mui/material";
import MainCardHeading from "../common/MainCardHeading";
import CustomBarChart from "../common/CustomBarChart";
export default function Services({ serviceData }) {
  const formattedData = serviceData.map(({ friendly_name, response_time }) => ({
    label: friendly_name,
    value: response_time,
  }));
  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Service Latency" />
        <CustomBarChart
          dataset={formattedData}
          chartProps={{ width: 800, height: 300 }}
        />
      </CardContent>
    </Card>
  );
}
