import { LineChart } from "@mui/x-charts";
import { Typography, Card, CardContent } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { useData } from "../../hooks/useData";
import { red } from "@mui/material/colors";

export default function APIActivityChart() {
  const { data, loading, fetchError } = useData("/monitoring/activity", null);
  if (loading) {
    return <LoadingState />;
  }
  if (fetchError) {
    return <ErrorState error={fetchError} />;
  }
  const { request_timeseries, error_timeseries } = data;
  const label = "API Activity & Error Rate";
  const dateLabels = Object.keys(request_timeseries).map((date) => {
    const [year, month, day] = date.split("-");
    const dateObject = new Date(year, month - 1, day);
    return dateObject;
  });
  const requestValues = Object.entries(request_timeseries).map(
    ([_, details]) => details.total_count
  );

  const errorValues = Object.entries(error_timeseries).map(
    ([_, details]) => details.total_count
  );
  // TO DO move card content to a separate component
  return (
    <Card>
      <CardContent>
        <MainCardHeading title={label} />
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
            { data: requestValues, showMark: false },
            {
              data: errorValues,
              color: red[400],
              showMark: false,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
