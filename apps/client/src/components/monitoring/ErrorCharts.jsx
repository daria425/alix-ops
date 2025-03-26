import CustomBarChart from "../common/CustomBarChart";
import { Card, CardContent } from "@mui/material";
import MainCardHeading from "../common/MainCardHeading";

const accumulateByService = (errors) => {
  const groupedData = errors.reduce((acc, error) => {
    const service = error.service || "unknown";
    if (!acc[service]) {
      acc[service] = { service, count: 0, errors: [] };
    }
    acc[service].count += 1;
    acc[service].errors.push(error);
    return acc;
  }, {});

  return Object.values(groupedData);
};

export default function ErrorCharts({ errorChartData }) {
  const isLoading = Object.keys(errorChartData).length === 0;
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <MainCardHeading title="Errors - Last 24 hours" />
          <div
            style={{
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }
  const hasErrors = errorChartData?.total_count > 0;
  const errorData = errorChartData?.documents || [];
  const accumulatedData = accumulateByService(errorData);
  const dataset = accumulatedData.map(({ service, count }) => ({
    label: service,
    value: count,
  }));

  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Errors - Last 24 hours" />
        {hasErrors && dataset.length > 0 ? (
          <CustomBarChart dataset={dataset} chartProps={{ height: 300 }} />
        ) : (
          <div
            style={{
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            No errors in the last 24 hours
          </div>
        )}
      </CardContent>
    </Card>
  );
}
