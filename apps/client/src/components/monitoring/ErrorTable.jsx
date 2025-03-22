import CustomTable from "../common/CustomTable";

export default function ErrorTable({ errorDocuments }) {
  const tableData = {
    headers: ["Error", "Date", "Service"],
    rows: errorDocuments.map(({ error, timestamp, service }) => [
      error,
      timestamp,
      service,
    ]),
  };
  const isLoading = tableData.rows.length === 0;
  return <CustomTable tableData={tableData} loading={isLoading} />;
}
