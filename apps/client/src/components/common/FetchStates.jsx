import { Box, Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LinearProgress from "@mui/material/LinearProgress";
function ErrorState({ error, errorAlertConfig = {}, errorComponent = null }) {
  const reloadPage = () => {
    window.location.reload();
  };
  if (errorComponent) {
    return errorComponent;
  }
  return (
    <Dialog
      open={true}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          bgcolor: red[50],
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "text.primary",
          ...errorAlertConfig,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            color: red[500],
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
          {error?.status ? `Error: ${error.status}` : "Error"}
        </DialogTitle>
        <Typography variant="body1">
          {error?.message
            ? `${error.message}`
            : "An unexpected error occured, please try again"}
        </Typography>
        <DialogActions>
          <Button onClick={reloadPage} variant="text" color="inherit">
            Reload Page
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
function LoadingState({ loadingBoxConfig = {}, loadingComponent = null }) {
  if (loadingComponent) {
    return loadingComponent;
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        ...loadingBoxConfig,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        boxSizing: "border-box",
      }}
    >
      <LinearProgress sx={{ width: "50%" }} />
    </Box>
  );
}

export { LoadingState, ErrorState };
