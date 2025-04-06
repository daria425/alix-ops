import { Box } from "@mui/material";
import OverviewCards from "./OverviewCards";
import APIActivity from "./APIActivity";
import ErrorSummary from "./ErrorSummary";
import WhatsAppStream from "./WhatsAppStream";
export default function MonitorDashboard() {
  //TO-DO: return loading wrapper if !message

  return (
    <>
      <Box sx={{ display: "flex", gap: 2 }}>
        <OverviewCards height={300} />
        <WhatsAppStream />
      </Box>
      <APIActivity />
      <ErrorSummary />
    </>
  );
}
