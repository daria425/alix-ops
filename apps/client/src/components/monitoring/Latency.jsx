import { Card, CardContent, Typography, Box } from "@mui/material";
import MainCardHeading from "../common/MainCardHeading";
import CustomBarChart from "../common/CustomBarChart";
export default function Latency({ serviceResponses }) {
  return (
    <Card sx={{ minWidth: "300px" }}>
      <CardContent>
        <MainCardHeading title="Service Latency" />
        {serviceResponses.length > 0 ? (
          <CustomBarChart
            dataset={serviceResponses.map(
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
          <Typography variant="body1">Loading service data</Typography>
        )}
      </CardContent>
    </Card>
  );
}
