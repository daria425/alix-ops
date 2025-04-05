import { SingleLineChart } from "../common/CustomCharts";
import { MainCardHeading } from "../common/CardContents";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import { LoadingState, ErrorState } from "../common/FetchStates";
import LinearProgress from "@mui/material/LinearProgress";
import { useData } from "../../hooks/useData";
import useMediaQuery from "@mui/material/useMediaQuery";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { red } from "@mui/material/colors";

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

function ChartsError({ error, height, refetch }) {
  return (
    <Box
      sx={{
        height: height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
        gap: 2,
        bgcolor: red[50],
      }}
    >
      <ErrorOutlineIcon
        sx={{
          color: red[500],
          fontSize: 25,
        }}
      />
      <Typography variant="h6">Error: {error?.status || null}</Typography>
      <Typography variant="body1">
        {error?.message || "An error occurred loading data"}
      </Typography>
      <Button variant="text" onClick={refetch} color="inherit">
        TRY AGAIN
      </Button>
    </Box>
  );
}
export default function DashboardCharts({ chartProps }) {
  let { loading, fetchError, data, refetch } = useData(
    "/platform/stats/summary/daily",
    null
  );
  const { height = 300 } = chartProps;
  const isMobile = useMediaQuery("(max-width:768px)");
  const cardLayoutStyle =
    loading || fetchError
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
          <ErrorState
            errorComponent={
              <ChartsError
                error={fetchError}
                height={height}
                refetch={refetch}
              />
            }
          />
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
