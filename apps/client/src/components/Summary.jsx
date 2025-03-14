import { Grid2 } from "@mui/material";
import StatsCard from "./StatsCard";
export default function Summary({ summaryData }) {
  return (
    <Grid2 container spacing={4}>
      {summaryData.map((data, index) => (
        <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard key={index} title={data.title} value={data.value} />
        </Grid2>
      ))}
    </Grid2>
  );
}
