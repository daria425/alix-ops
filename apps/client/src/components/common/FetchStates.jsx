import { Box } from "@mui/material";

function ErrorState({ error, errorBoxConfig = {}, errorComponent = null }) {
  if (errorComponent) {
    return errorComponent;
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        ...errorBoxConfig,
      }}
    >
      <p>Error: {error?.message || "An unexpected error occurred"}</p>
    </Box>
  );
}
function LoadingState({ loadingBoxConfig = {}, loadingComponent = null }) {
  if (loadingComponent) {
    return loadingComponent;
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        ...loadingBoxConfig,
      }}
    >
      <p>Loading...</p>
    </Box>
  );
}

export { LoadingState, ErrorState };
