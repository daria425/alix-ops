import { SingleLineChart } from "../common/CustomCharts";
import { MainCardHeading } from "../common/CardContents";
import { Box, Card, CardContent } from "@mui/material";
import { LoadingState, ErrorState } from "../common/FetchStates";
import LinearProgress from "@mui/material/LinearProgress";
import { useData } from "../../hooks/useData";
import useMediaQuery from "@mui/material/useMediaQuery";

function ChartsLoading({ height }) {
  return (
    <Box
      sx={{
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LinearProgress sx={{ width: "50%" }} />
    </Box>
  );
}
export default function DashboardCharts({ chartProps }) {
  let { loading, fetchError, data } = useData(
    "/platform/stats/summary/daily",
    null
  );
  loading = true;
  const { height = 300 } = chartProps;
  const isMobile = useMediaQuery("(max-width:768px)");
  const cardLayoutStyle = loading
    ? { "display": "block" }
    : isMobile
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
          <LoadingState loadingComponent={<ChartsLoading height={height} />} />
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
