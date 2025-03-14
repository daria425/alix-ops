import { Card, CardContent, Typography } from "@mui/material";

export default function StatsCard({ title, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, mt: 1 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "500", mb: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
