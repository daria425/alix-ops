import { Grid2, Card, CardContent } from "@mui/material";
import StatsCard from "./StatsCard";
import MainCardHeading from "./MainCardHeading";
export default function Summary({ summaryTitle, summaryData, children }) {
  return (
    <Card>
      <CardContent>
        <MainCardHeading title={summaryTitle} />
        {children}
        <Grid2 container spacing={4}>
          {summaryData.map((data, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                key={index}
                title={data.title}
                value={data.value}
                icon={data.icon}
              />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
