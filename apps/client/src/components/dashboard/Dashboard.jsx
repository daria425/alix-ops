import DashboardCharts from "./DashboardCharts";
import { useData } from "../../hooks/useData";
import { Box, Typography, Button } from "@mui/material";
import { LoadingState, ErrorState } from "../common/FetchStates";
import Summary from "../common/Summary";
import TryIcon from "@mui/icons-material/Try";
import Groups3Icon from "@mui/icons-material/Groups3";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
//eslint-disable-next-line
const buttons = [
  { text: "Test Suite", onClick: () => {} },
  { text: "Builds & Deployments", onClick: () => {} },
  { text: "Snippet Repo", onClick: () => {} },
];

export default function Dashboard() {
  let { loading, fetchError, data } = useData("/platform", null);
  if (loading) {
    return <LoadingState />;
  }
  if (fetchError) {
    return <ErrorState error={fetchError} />;
  }

  return (
    <Box padding={2}>
      <Typography variant="h2">Overview</Typography>
      <Summary
        summaryTitle="PLATFORM USAGE"
        summaryData={[
          {
            title: "Organizations",
            value: data?.organizations?.total_count,
            icon: <Groups3Icon />,
          },
          {
            title: "Flows",
            value: data?.flows?.total_count,
            icon: <TryIcon />,
          },
          {
            title: "Users",
            value: data?.users?.total_count,
            icon: <AccountCircleIcon />,
          },
        ]}
      >
        <Box>
          <Button variant="contained" color="secondary">
            + Create New
          </Button>
        </Box>
      </Summary>
      {/* <WidgetCard buttons={buttons} cardHeader={"Tools"} /> */}
      <DashboardCharts
        chartProps={{
          height: 300,
        }}
      />
    </Box>
  );
}
