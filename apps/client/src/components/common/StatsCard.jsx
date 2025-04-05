import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function StatsCard({ title, value, icon }) {
  return (
    <Box>
      <Box
        sx={{
          border: `2px solid ${grey["200"]}`,
          p: 2,
          mt: 2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body1"
            sx={{ mb: 1, mt: 1, color: "text.secondary" }}
          >
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: "500", mb: 1 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
