import { BarChart } from "@mui/x-charts/BarChart";

export default function CustomBarChart({ dataset, chartProps }) {
  const labels = dataset.map((data) => data.label);
  const series = dataset.map((data) => data.value);
  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: labels }]}
      series={[{ data: series }]}
      {...chartProps}
    />
  );
}
