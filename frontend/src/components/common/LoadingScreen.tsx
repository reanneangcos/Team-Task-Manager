import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        color: "text.secondary",
      }}
    >
      <CircularProgress thickness={4} />
      <Typography sx={{ fontWeight: 700 }}>Loading...</Typography>
    </Box>
  );
}
