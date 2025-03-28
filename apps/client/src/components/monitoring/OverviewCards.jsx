import { Card, CardContent, Typography, Box } from "@mui/material";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { useData } from "../../hooks/useData";
export default function OverviewCards() {
  const { data, loading, fetchError } = useData("/monitoring/overview", null);
  if (loading) {
    return <LoadingState />;
  }
  if (fetchError) {
    return <ErrorState error={fetchError} />;
  }
  console.log(data);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        gap: 2,
        gridTemplateRows: "50% 50%",
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <Card key={key} sx={{ width: 200, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
              {key.replace(/_/g, " ")}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
