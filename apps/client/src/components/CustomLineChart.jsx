import { LineChart } from "@mui/x-charts/LineChart";

export default function CustomLineChart({ chartDataset, chartProps }) {
  console.log(chartDataset);
  const { label, dataset } = chartDataset;
  const series = dataset.daily_counts.map((d) => d.value);
  const labels = dataset.daily_counts.map((d) => new Date(d.date));
  console.log("labels", labels);

  return (
    <LineChart
      xAxis={[
        {
          data: labels,
          scaleType: "time",
          valueFormatter: (d) =>
            d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
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
  );
}
