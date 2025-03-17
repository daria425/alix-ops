import CustomLineChart from "./CustomLineChart";
import { Card, CardContent } from "@mui/material";
import { mockChartData } from "../../mockData/mockChartData";
import { useData } from "../hooks/useData";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function MultiChartContainer({ chartProps }) {
  //eslint-disable-next-line
  const { loading, fetchError, data } = useData(
    "/platform/stats/summary/daily",
    null
  );
  const isMobile = useMediaQuery("(max-width:768px)");
  const finalData =
    import.meta.env.MODE === "development" ? mockChartData : data;
  const chartData = finalData?.data;

  return (
    <Card>
      <CardContent sx={{ display: isMobile ? "block" : "flex" }}>
        {chartData.map((dataset, index) => (
          <CustomLineChart
            key={index}
            chartDataset={dataset}
            chartProps={chartProps}
          />
        ))}
      </CardContent>
    </Card>
  );
}
