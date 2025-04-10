import { Box, Container } from "@mui/material";
import OverviewCards from "./OverviewCards";
import APIActivity from "./APIActivity";
import ErrorSummary from "./ErrorSummary";
import WhatsAppStream from "./WhatsAppStream";
import { useMediaQuery } from "@mui/material";
export default function MonitorDashboard() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const maxHeight = 500;
  const cardLayoutStyle = isMobile
    ? {
        display: "block",
      }
    : {
        display: "flex",
        gap: 2,
        height: maxHeight,
      };
  return (
    <>
      <Box sx={cardLayoutStyle}>
        <OverviewCards height={maxHeight} />
        <WhatsAppStream maxHeight={maxHeight} />
      </Box>
      <APIActivity />
      <ErrorSummary />
    </>
  );
}
