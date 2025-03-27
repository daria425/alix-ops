import { Typography } from "@mui/material";

export default function MainCardHeading({ title, additonalStyles }) {
  return (
    <Typography
      variant="h3"
      sx={{
        mb: 1,
        mt: 1,
        fontWeight: "500",
        fontSize: "1.3rem",
        ...additonalStyles,
      }}
    >
      {title}
    </Typography>
  );
}
