import CustomBarChart from "../common/CustomBarChart";
import { orange } from "@mui/material/colors";
export default function LatencyChart({ response_time }) {
  return (
    <CustomBarChart
      dataset={[{ label: "WhatsApp Message Latency", value: response_time }]}
      chartProps={{ height: 300 }}
      seriesProps={{ color: orange[400] }}
    />
  );
}
