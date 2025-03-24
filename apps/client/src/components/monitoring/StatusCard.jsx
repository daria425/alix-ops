import { Card, CardContent, Grid2, Box, Typography } from "@mui/material";
import MainCardHeading from "../common/MainCardHeading";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { grey } from "@mui/material/colors";
function StatusItem({ friendly_name, status_code }) {
  return (
    <Grid2 size={6} item>
      <Box sx={{ bgcolor: grey[50], p: 1, mb: 1 }}>
        <Typography variant="h6">{friendly_name}</Typography>
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {status_code === 200 ? (
          <CheckCircleIcon fontSize="large" color="success" />
        ) : (
          <ErrorIcon fontSize="large" color="error" />
        )}
      </Box>
    </Grid2>
  );
}
export default function StatusCard({ statusData }) {
  const isLoading = statusData.length === 0;

  return (
    <Card>
      <CardContent>
        <MainCardHeading title="Service Status" />
        <Box sx={{ maxWidth: "500px" }}>
          <Grid2 container spacing={2}>
            {!isLoading ? (
              statusData.map(({ friendly_name, status_code }) => (
                <StatusItem
                  key={friendly_name}
                  friendly_name={friendly_name}
                  status_code={status_code}
                />
              ))
            ) : (
              <Box>Loading data...</Box>
            )}
          </Grid2>
        </Box>
      </CardContent>
    </Card>
  );
}
