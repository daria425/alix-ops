import { Card, CardContent, Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import MainCardHeading from "../common/MainCardHeading";
import CustomBarChart from "../common/CustomBarChart";
import LatencyChart from "./LatencyChart";
export default function Latency({ serviceResponses, latencyResponse }) {
  //   const formattedData =
  //     serviceResponses?.map(({ friendly_name, response_time }) => ({
  //       label: friendly_name,
  //       value: response_time,
  //     })) ?? [];
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1200px)") && !isMobile;

  const chartLayout = isMobile
    ? {
        "display": "block",
      }
    : isTablet
    ? {
        "display": "grid",
        gridTemplateColumns: "1fr 1fr",
      }
    : {
        "display": "grid",
        gridTemplateColumns: "70% 1fr",
      };

  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Service Latency" />
        {latencyResponse && serviceResponses.length > 0 ? (
          <Box sx={chartLayout}>
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
            <LatencyChart response_time={latencyResponse.response_time} />
          </Box>
        ) : (
          <Typography variant="body1">Loading service data</Typography>
        )}
      </CardContent>
    </Card>
  );
}
