import ErrorIcon from "@mui/icons-material/Error";
import BugReportIcon from "@mui/icons-material/BugReport";
import Groups3Icon from "@mui/icons-material/Groups3";
import Summary from "../common/Summary";
const countUniqueKeyValues = (array, key) => {
  return array.reduce((acc, obj) => {
    const value = obj[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};
export default function ErrorSummaryCards({ errors }) {
  const summaryTitle = "Errors";
  const { documents = [], total_count = "" } = errors || {};
  const errorData = [
    {
      title: "Total Errors",
      value: total_count,
      icon: <ErrorIcon />,
    },
    {
      title: "Total Affected Services",
      value: Object.keys(countUniqueKeyValues(documents, "service")).length,
      icon: <BugReportIcon />,
    },
    {
      title: "Organizations Impacted",
      value: Object.keys(countUniqueKeyValues(documents, "organizationId"))
        .length,
      icon: <Groups3Icon />,
    },
  ];
  if (documents.length > 0) {
    return <Summary summaryTitle={summaryTitle} summaryData={errorData} />;
  }
}
