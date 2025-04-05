import { Card, CardContent, Box } from "@mui/material";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { useData } from "../../hooks/useData";
import {
  SummaryCardHeading,
  CardCaption,
  CardValue,
} from "../common/CardContents";
import LinearProgress from "@mui/material/LinearProgress";

const titleMap = {
  "total_errors": "Total Errors",
  "total_uptime": "Total Uptime",
  "average_latency": "Average Latency",
  "flows_executed": "Flows Executed",
};

const addUnits = (title, value) => {
  if (title === "average_latency") {
    return `${value}ms`;
  } else if (title === "total_uptime") {
    return `${value}%`;
  }
  return value;
};

const getCaption = (title, value) => {
  if (title == "total_errors") {
    if (value == 0) {
      return "No errors in the last 24 hours";
    }
    return `${value} errors in the last 24 hours`;
  }
  if (title == "total_uptime") {
    return `${value}% average uptime in the last 24 hours`;
  }
  if (title === "average_latency") {
    return `${value}ms average latency in the last 24 hours`;
  }
  if (title === "flows_executed") {
    return `${value} flows executed in the last 24 hours`;
  }
};

function OverviewCardLoader({ height }) {
  return (
    <Box
      sx={{
        height: height,
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LinearProgress sx={{ width: "50%" }} />
    </Box>
  );
}
function OverviewCard({ title, value }) {
  return (
    <Card>
      <CardContent>
        <SummaryCardHeading
          title={titleMap[title]}
          additionalStyles={{ textWrap: "nowrap", mt: 1, mb: 1 }}
        />
        <CardValue
          value={addUnits(title, value)}
          additionalStyles={{ mt: 2, mb: 2 }}
        />
        <CardCaption
          caption={getCaption(title, value)}
          additionalStyles={{ mt: 1, mb: 1 }}
        />
      </CardContent>
    </Card>
  );
}
export default function OverviewCards({ height }) {
  let { data, loading, fetchError } = useData("/monitoring/overview", null);
  if (loading) {
    return <OverviewCardLoader height={height} />;
  }
  if (fetchError) {
    return <ErrorState error={fetchError} />;
  }
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 2,
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <OverviewCard key={key} title={key} value={value} />
      ))}
    </Box>
  );
}
