import { LineChart } from "@mui/x-charts";
import { Card, CardContent, Box, Typography, Grid2 } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { useData } from "../../hooks/useData";
import { red, cyan, grey } from "@mui/material/colors";

function ActivityLegend({ legendData }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        bgcolor: grey[100],
        p: 2,
      }}
    >
      {legendData.map((item, index) => (
        <Box key={index}>
          <Typography variant="body2" color="textSecondary">
            {item.label}
          </Typography>
          <Grid2 container size={6} alignItems={"center"} gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.legendColor,
              }}
            />
            <Typography variant="h4" sx={{ fontSize: "2.2rem" }}>
              {item.value}
            </Typography>
          </Grid2>
        </Box>
      ))}
    </Box>
  );
}

function APIActivityChart({
  dateLabels,
  requestValues,
  errorValues,
  chartColors,
}) {
  return (
    <LineChart
      height={300}
      xAxis={[
        {
          data: dateLabels,
          scaleType: "time",
          valueFormatter: (d) =>
            d.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }),
          tickSize: 0, // Remove tick marks
          axisLine: {
            stroke: "#aaa", // Change x-axis color
            strokeWidth: 2, // Change x-axis thickness
          },
        },
      ]}
      yAxis={[
        {
          disableLine: true,
          tickSize: 0, // Remove tick marks
        },
      ]}
      grid={{
        vertical: false, // Hide vertical grid lines
        horizontal: true, // Show horizontal grid lines
        strokeDasharray: "3 3", // Optional: makes grid lines dashed
        stroke: "#ccc", // Grid color
        strokeWidth: 1, // Grid thickness
      }}
      series={[
        { data: requestValues, showMark: false, color: chartColors.request },
        {
          data: errorValues,
          color: chartColors.error,
          showMark: false,
        },
      ]}
    />
  );
}

export default function APIActivity() {
  const { data, loading, fetchError } = useData("/monitoring/activity", null);
  const { request_timeseries = {}, error_timeseries = {} } = data || {};
  const dateLabels = Object.keys(request_timeseries).map((date) => {
    const [year, month, day] = date.split("-");
    const dateObject = new Date(year, month - 1, day);
    return dateObject;
  });
  const requestValues = Object.entries(request_timeseries).map(
    ([, details]) => details?.total_count || 0
  );

  const errorValues = Object.entries(error_timeseries).map(
    ([, details]) => details?.total_count || 0
  );
  const totalRequests = requestValues.reduce((a, b) => a + b, 0);
  const totalErrors = errorValues.reduce((a, b) => a + b, 0);
  const chartColors = {
    request: cyan[400],
    error: red[400],
  };
  return (
    <Card>
      <CardContent>
        <MainCardHeading title="API ACTIVITY" />
        {loading ? (
          <LoadingState />
        ) : fetchError ? (
          <ErrorState error={fetchError} />
        ) : (
          <>
            <ActivityLegend
              totalRequests={totalRequests}
              totalErrors={totalErrors}
              legendData={[
                {
                  label: "Total Requests",
                  value: totalRequests,
                  legendColor: chartColors.request,
                },
                {
                  label: "Total Errors",
                  value: totalErrors,
                  legendColor: chartColors.error,
                },
              ]}
            />
            <APIActivityChart
              dateLabels={dateLabels}
              requestValues={requestValues}
              errorValues={errorValues}
              chartColors={chartColors}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
