import { Card, CardContent, Typography } from "@mui/material";
import MainCardHeading from "../common/MainCardHeading";
import CustomBarChart from "../common/CustomBarChart";

export default function Services({ serviceResponses }) {
  //   const formattedData =
  //     serviceResponses?.map(({ friendly_name, response_time }) => ({
  //       label: friendly_name,
  //       value: response_time,
  //     })) ?? [];

  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Service Latency" />
        {serviceResponses && serviceResponses.length > 0 ? (
          <CustomBarChart
            dataset={serviceResponses.map(
              ({ friendly_name, response_time }) => ({
                label: friendly_name,
                value: response_time,
              })
            )}
            chartProps={{ height: 300 }}
          />
        ) : (
          <Typography variant="body1">Loading service data</Typography>
        )}
      </CardContent>
    </Card>
  );
}
