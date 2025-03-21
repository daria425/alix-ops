import CustomLineChart from "../common/CustomLineChart";
export default function StatusChart({ chartDataset, chartProps }) {
  return (
    <CustomLineChart
      chartDataset={chartDataset}
      chartProps={chartProps}
      dataKey={chartDataset.label}
      valueFormatType={"HH:mm:ss"}
    />
  );
}
