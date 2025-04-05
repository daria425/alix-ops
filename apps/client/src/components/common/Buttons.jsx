import { Button } from "@mui/material";

function SecondaryButton({ buttonText, buttonProps }) {
  return (
    <Button variant="contained" color="secondary" sx={{ ...buttonProps }}>
      {buttonText}
    </Button>
  );
}

function PrimaryButton({ buttonText, buttonProps }) {
  return (
    <Button variant="contained" color="primary" sx={{ ...buttonProps }}>
      {buttonText}
    </Button>
  );
}

export { SecondaryButton, PrimaryButton };
