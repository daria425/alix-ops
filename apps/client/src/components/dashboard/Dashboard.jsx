import DashboardCharts from "./DashboardCharts";
import { useData } from "../../hooks/useData";
import { Box, Typography, Button } from "@mui/material";
import { mockDashboardData } from "../../../mockData/mockDashboardData";
import { LoadingState, ErrorState } from "../common/FetchStates";
import Summary from "../common/Summary";
import WidgetCard from "../common/WidgetCard";
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
  const { loading, fetchError, data } = useData("/platform", null);

  // Use mock data in development mode without mutating variables
  const finalData =
    import.meta.env.MODE === "development" ? mockDashboardData : data;
  const isLoading = import.meta.env.MODE === "development" ? false : loading;
  const error = import.meta.env.MODE === "development" ? null : fetchError;

  if (isLoading) {
    return <LoadingState />;
  } else if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Box padding={2}>
      <Typography variant="h2">Overview</Typography>
      <Summary
        summaryTitle="Resources"
        summaryData={[
          {
            title: "Organizations",
            value: finalData?.organizations?.total_count,
            icon: <Groups3Icon />,
          },
          {
            title: "Flows",
            value: finalData?.flows?.total_count,
            icon: <TryIcon />,
          },
          {
            title: "Users",
            value: finalData?.users?.total_count,
            icon: <AccountCircleIcon />,
          },
        ]}
      >
        <Box>
          <Button variant="contained" color="secondary">
            + New Resource
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
