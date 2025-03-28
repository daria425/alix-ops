import CustomTable from "../common/CustomTable";
import { Card, CardContent } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import { format } from "date-fns";

export default function StatusTable({ statusData }) {
  const tableData = {
    headers: ["Service", "Status", "Date", "Time"],
    rows: statusData.map(({ friendly_name, status_code, data }) => {
      const timestamp = data?.timestamp;

      // Format timestamp if it exists
      let formattedDate = "";
      let formattedTime = "";

      if (timestamp) {
        const date = new Date(timestamp);
        formattedDate = format(date, "yyyy-MM-dd");
        formattedTime = format(date, "HH:mm:ss");
      }

      return [friendly_name, status_code, formattedDate, formattedTime];
    }),
  };
  const isLoading = tableData.rows.length === 0;
  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Service Status" />
        <CustomTable tableData={tableData} loading={isLoading} />
      </CardContent>
    </Card>
  );
}
