import CustomLineChart from "../common/CustomLineChart";
import MainCardHeading from "../common/MainCardHeading";
import { Card, CardContent, Typography, Grid2 } from "@mui/material";
import { mockChartData } from "../../../mockData/mockChartData";
import { useData } from "../../hooks/useData";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function DashboardCharts({ chartProps }) {
  //eslint-disable-next-line
  const { loading, fetchError, data } = useData(
    "/platform/stats/summary/daily",
    null
  );
  const isMobile = useMediaQuery("(max-width:768px)");
  const cardLayoutStyle = isMobile
    ? {
        "display": "block",
      }
    : {
        "display": "grid",
        gridTemplateColumns: "1fr 1fr",
      };
  const finalData =
    import.meta.env.MODE === "development" ? mockChartData : data;
  const chartData = finalData?.data || [];

  return (
    <Card>
      <CardContent sx={cardLayoutStyle}>
        <MainCardHeading
          title="WhatsApp Activity"
          additonalStyles={!isMobile ? { gridColumn: "span 2" } : {}}
        />
        {chartData.map((dataset, index) => (
          <CustomLineChart
            key={index}
            chartDataset={dataset}
            chartProps={chartProps}
            dataKey="daily_counts"
            valueFormatType="MMM d"
          />
        ))}
      </CardContent>
    </Card>
  );
}
