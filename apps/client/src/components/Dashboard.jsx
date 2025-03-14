import { useOutletContext } from "react-router";
import { useData } from "../hooks/useData";
import LoadingState from "./LoadingState";
import { Box, Typography, Button } from "@mui/material";
import { mockDashboardData } from "../../mockData/mockDashboardData";
import { mockFlowData } from "../../mockData/mockChartData";
import FetchError from "./FetchError";
import Summary from "./Summary";
import WidgetCard from "./WidgetCard";
import CustomLineChart from "./LineChart";

const buttons = [
  {
    text: "Test Suite",
    onClick: () => {},
  },
  {
    text: "Builds & Deployments",
    onClick: () => {},
  },
  {
    text: "Snippet Repo",
    onClick: () => {},
  },
];
export default function Dashboard() {
  //   const { authenticatedUser } = useOutletContext();
  //   const { loading, fetchError, data } = useData("/platform", null);
  //   console.log("Dashboard data", data);
  //   const { organizations = [], flows = [], users = [] } = data || {};
  const loading = false;
  const fetchError = false;
  const data = mockDashboardData;
  if (loading) {
    return <LoadingState />;
  } else if (fetchError) {
    return <FetchError error={fetchError} />;
  }
  return (
    <Box padding={2}>
      <Typography variant="h2">Overview</Typography>
      <Box>
        <Button variant="contained" color="secondary">
          + New Resource
        </Button>
      </Box>
      <Summary
        summaryData={[
          { title: "Organizations", value: data?.organizations["total_count"] },
          { title: "Flows", value: data?.flows["total_count"] },
          { title: "Users", value: data?.users["total_count"] },
        ]}
      />
      <WidgetCard buttons={buttons} cardHeader={"Tools"} />
      <CustomLineChart data={mockFlowData} chartProps={{ height: 300 }} />
    </Box>
  );
}
