import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

function CustomLineChart({
  chartDataset,
  chartProps,
  dataKey,
  valueFormatType,
}) {
  const { label = "", dataset = [] } = chartDataset;
  const series = dataset?.[dataKey]?.map((d) => d.value);
  const labels = dataset?.[dataKey]?.map((d) => new Date(d.date));
  const valueFormatterConfig = {
    "MMM d": (d) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
    "HH:mm:ss": (d) =>
      new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24-hour format
      }),
  };
  return (
    <Box sx={{ width: "100%" }}>
      {labels && series && (
        <>
          <Typography variant="body1">{label}</Typography>
          <LineChart
            xAxis={[
              {
                data: labels,
                scaleType: "time",
                valueFormatter: valueFormatterConfig[valueFormatType],
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
            series={[{ data: series, showMark: false }]}
            {...chartProps}
          />
        </>
      )}
    </Box>
  );
}

function CustomBarChart({ dataset, chartProps, seriesProps, xAxisProps }) {
  const labels = dataset.map((data) => data.label);
  const series = dataset.map((data) => data.value);
  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: labels, ...xAxisProps }]}
      series={[{ data: series, ...seriesProps }]}
      {...chartProps}
    />
  );
}

export { CustomLineChart, CustomBarChart };
