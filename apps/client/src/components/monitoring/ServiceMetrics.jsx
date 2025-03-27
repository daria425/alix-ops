import { Box } from "@mui/material";
import Latency from "./Latency";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ServiceMetrics({ serviceMetrics }) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const metricStyle = isMobile
    ? { flexDirection: "column" }
    : { flexDirection: "row" };
  return (
    <Box sx={{ ...metricStyle, gap: 2, display: "flex" }}>
      <Latency serviceResponses={serviceMetrics} />
    </Box>
  );
}
