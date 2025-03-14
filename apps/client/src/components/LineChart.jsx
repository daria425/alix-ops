import { LineChart } from "@mui/x-charts/LineChart";
export default function CustomLineChart({ data, chartProps }) {
  const series = data.map((d) => d.value);
  const labels = data.map((d) => new Date(d.date));
  console.log("labels", labels);
  return (
    <LineChart
      xAxis={[
        {
          data: labels,
          scaleType: "time",
          valueFormatter: (d) =>
            d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        },
      ]}
      series={[{ data: series, showMark: false }]}
      {...chartProps}
    />
  );
}
