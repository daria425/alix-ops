import MultiChartContainer from "./MultiChartContainer";
import { useData } from "../hooks/useData";
import LoadingState from "./LoadingState";
import { Box, Typography, Button } from "@mui/material";
import { mockDashboardData } from "../../mockData/mockDashboardData";
import FetchError from "./FetchError";
import Summary from "./Summary";
import WidgetCard from "./WidgetCard";

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
    return <FetchError error={error} />;
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
          {
            title: "Organizations",
            value: finalData?.organizations?.total_count,
          },
          { title: "Flows", value: finalData?.flows?.total_count },
          { title: "Users", value: finalData?.users?.total_count },
        ]}
      />
      <WidgetCard buttons={buttons} cardHeader={"Tools"} />
      <MultiChartContainer chartProps={{ height: 300 }} />
    </Box>
  );
}
