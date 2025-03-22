import { Card, CardContent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import MainCardHeading from "../common/MainCardHeading";
import StatusChart from "./StatusChart";

export default function StatusGrid({ statusChartData }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1200px)") && !isMobile;

  const cardLayoutStyle = isMobile
    ? {
        "display": "block",
      }
    : isTablet
    ? {
        "display": "grid",
        gridTemplateColumns: "1fr 1fr",
      }
    : {
        "display": "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
      };

  return (
    <Card>
      <CardContent sx={cardLayoutStyle}>
        <MainCardHeading
          title="Service Status"
          additonalStyles={
            !isMobile ? { gridColumn: isTablet ? "span 2" : "span 4" } : {}
          }
        />
        {statusChartData.map((data, index) => (
          <StatusChart
            key={index}
            chartDataset={data}
            chartProps={{ height: 300 }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
