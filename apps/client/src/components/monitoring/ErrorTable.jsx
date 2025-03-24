import CustomTable from "../common/CustomTable";
import { parseISO, format } from "date-fns";
import { Card, CardContent } from "@mui/material";
import MainCardHeading from "../common/MainCardHeading";
export default function ErrorTable({ errorDocuments }) {
  const tableData = {
    headers: ["Error", "Date", "Time", "Service"],
    rows: errorDocuments.map(({ error, timestamp, service }) => {
      // Parse the ISO timestamp
      const date = parseISO(timestamp);

      // Format the date and time separately
      const formattedDate = format(date, "yyyy-MM-dd");
      const formattedTime = format(date, "HH:mm:ss");

      return [error, formattedDate, formattedTime, service];
    }),
  };
  const isLoading = tableData.rows.length === 0;
  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Errors" />
        <CustomTable tableData={tableData} loading={isLoading} />
      </CardContent>
    </Card>
  );
}
