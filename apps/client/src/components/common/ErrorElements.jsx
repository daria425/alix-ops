import { useRouteError, useNavigationType, useNavigate } from "react-router";
import { AuthContext } from "../../services/AuthProvider";
import { useContext } from "react";
import { Button, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function getFriendlyAppErrorMessage(errorStatus) {
  const errorMapping = {
    404: "The requested page was not found.",
  };
  return (
    errorMapping[errorStatus] ||
    "Unexpected error. Try reloading the page below"
  );
}

function getFriendlyAuthErrorMessage(errorMessage) {
  console.log(errorMessage);
  const errorMapping = {
    "Firebase: Error (auth/invalid-email).":
      "Invalid login credentials. Please try again.",
    "Firebase: Error (auth/user-not-found).":
      "Invalid login credentials. Please try again.",
    "Firebase: Error (auth/wrong-password).":
      "Invalid login credentials. Please try again.",
    "Firebase: Error (auth/email-already-in-use).":
      "Invalid login credentials. Please try again.",
    "Firebase: Error (auth/weak-password).":
      "Invalid login credentials. Please try again.",
    "Firebase: Error (auth/invalid-credential).":
      "Invalid login credentials. Please try again.",
    "Firebase: Error (auth/network-request-failed).":
      "Network error. Please check your connection.",
    "Firebase: Error (auth/too-many-requests).":
      "Too many login attempts. Please try again later.",
    "Firebase: Error (auth/id-token-expired).":
      "Your session has expired. Please log in again.",
    "Firebase: Error (auth/internal-error).":
      "An internal error occurred. Please try again later.",
  };
  return (
    errorMapping[errorMessage] ||
    "Unexpected application error. Please try again"
  );
}

function ApplicationErrorButton({ onClick, buttonText }) {
  return (
    <Button onClick={onClick} variant="text" color="inherit">
      {buttonText}
    </Button>
  );
}
function ApplicationError() {
  const nav = useNavigate();
  const navigationType = useNavigationType();
  const error = useRouteError();
  const reloadPage = () => {
    window.location.reload();
  };
  const goBack = () => {
    if (navigationType === "POP") {
      nav(-1);
    } else {
      nav("/"); // Redirect to a fallback page
    }
  };
  return (
    <Dialog
      open={true}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "text.primary",
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 50,
          }}
        />
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "inherit",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          An application error occurred:
        </DialogTitle>
        <Typography variant="body1">
          {getFriendlyAppErrorMessage(error?.status)}
        </Typography>
        <DialogActions>
          <ApplicationErrorButton
            onClick={error?.status === 404 ? goBack : reloadPage}
            buttonText={error?.status === 404 ? "Go Back" : "Reload Page"}
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

function AuthenticationError() {
  const nav = useNavigate();
  const { error } = useContext(AuthContext);
  const handleBackToLogin = () => {
    nav("/login");
  };
  return (
    <Dialog
      open={true}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "text.primary",
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 50,
          }}
        />
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "inherit",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          An application error occurred:
        </DialogTitle>
        <Typography variant="body1">
          {getFriendlyAuthErrorMessage(error?.message)}
        </Typography>
        <DialogActions>
          <ApplicationErrorButton
            onClick={handleBackToLogin}
            buttonText="Return to Login"
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export { ApplicationError, AuthenticationError };
