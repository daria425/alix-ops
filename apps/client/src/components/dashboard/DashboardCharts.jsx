import { SingleLineChart } from "../common/CustomCharts";
import { MainCardHeading } from "../common/CardContents";
import { Card, CardContent } from "@mui/material";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { useData } from "../../hooks/useData";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function DashboardCharts({ chartProps }) {
  const { loading, fetchError, data } = useData(
    "/platform/stats/summary/daily",
    null
  );
  const isMobile = useMediaQuery("(max-width:768px)");
  const cardLayoutStyle = isMobile
    ? {
        "display": "block",
      }
    : {
        "display": "grid",
        gridTemplateColumns: "1fr 1fr",
      };

  return (
    <Card>
      <CardContent sx={cardLayoutStyle}>
        <MainCardHeading
          title="WHATSAPP ACTIVITY"
          additionalStyles={!isMobile ? { gridColumn: "span 2" } : {}}
        />
        {loading ? (
          <LoadingState />
        ) : fetchError ? (
          <ErrorState error={fetchError} />
        ) : (
          data.data.map((dataset, index) => (
            <SingleLineChart
              key={index}
              chartDataset={dataset}
              chartProps={chartProps}
              dataKey="daily_counts"
              valueFormatType="MMM d"
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
