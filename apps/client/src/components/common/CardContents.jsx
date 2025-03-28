import { Typography } from "@mui/material";

function MainCardHeading({ title, additionalStyles }) {
  return (
    <Typography
      variant="h3"
      sx={{
        mb: 1,
        mt: 1,
        fontWeight: "500",
        fontSize: "1.3rem",
        ...additionalStyles,
      }}
    >
      {title}
    </Typography>
  );
}

function SummaryCardHeading({ title, additionalStyles }) {
  return (
    <Typography
      variant="h6"
      sx={{
        mb: 1,
        mt: 1,
        fontSize: "0.95rem",
        fontWeight: "400",
        color: "text.secondary",
        ...additionalStyles,
      }}
    >
      {title}
    </Typography>
  );
}

function CardCaption({ caption, additionalStyles }) {
  return (
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        fontSize: "0.8rem",
        fontWeight: "400",
        mt: 1,
        ...additionalStyles,
      }}
    >
      {caption}
    </Typography>
  );
}

function CardValue({ value, additionalStyles }) {
  return (
    <Typography variant="h4" sx={{ fontWeight: "500", ...additionalStyles }}>
      {value}
    </Typography>
  );
}
export { MainCardHeading, SummaryCardHeading, CardCaption, CardValue };
