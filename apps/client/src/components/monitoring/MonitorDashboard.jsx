import { Box } from "@mui/material";
import ServiceMetrics from "./ServiceMetrics";
import OverviewCards from "./OverviewCards";
import APIActivity from "./APIActivity";
export default function MonitorDashboard() {
  //TO-DO: return loading wrapper if !message

  return (
    <>
      <Box sx={{ display: "flex", gap: 2 }}>
        <OverviewCards />
        <ServiceMetrics />
      </Box>
      <APIActivity />
    </>
  );
}
