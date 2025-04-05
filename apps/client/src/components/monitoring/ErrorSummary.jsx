import CustomTable from "../common/CustomTable";
import { parseISO, format } from "date-fns";
import { Card, CardContent } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { useData } from "../../hooks/useData";
function ErrorTable({ errorDocuments }) {
  const tableData = {
    headers: ["Error", "Date", "Time", "Service", "Environment"],
    rows: errorDocuments.map(({ error, timestamp, service, environment }) => {
      // Parse the ISO timestamp
      const date = parseISO(timestamp);

      // Format the date and time separately
      const formattedDate = format(date, "yyyy-MM-dd");
      const formattedTime = format(date, "HH:mm:ss");

      return [error, formattedDate, formattedTime, service, environment];
    }),
  };
  const isLoading = tableData.rows.length === 0;
  return <CustomTable tableData={tableData} loading={isLoading} />;
}

export default function ErrorSummary() {
  const { data, loading, fetchError } = useData("/monitoring/errors", null); //eslint-disable-line
  const { documents = [], total_count = 0 } = data || {};
  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Errors" />
        {loading ? (
          <LoadingState />
        ) : fetchError ? (
          <ErrorState error={fetchError} />
        ) : (
          <ErrorTable errorDocuments={documents} />
        )}
      </CardContent>
    </Card>
  );
}
