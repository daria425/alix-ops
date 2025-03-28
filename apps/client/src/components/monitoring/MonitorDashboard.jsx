import { Box } from "@mui/material";
import ServiceMetrics from "./ServiceMetrics";
import OverviewCards from "./OverviewCards";
export default function MonitorDashboard() {
  //TO-DO: return loading wrapper if !message
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <OverviewCards />
      <ServiceMetrics />
    </Box>
  );
}
