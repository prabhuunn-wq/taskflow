import { Box, CircularProgress } from "@mui/material";

const LoadingState = () => {
  return (
    <Box
      sx={{
        minHeight: 350,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingState;