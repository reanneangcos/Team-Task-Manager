import { Box, Container } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { User } from "../../types";
import AppNavbar from "./AppNavbar";

interface AppLayoutProps {
  user: User | null;
  setUser: (user: User | null) => void;
  children: ReactNode;
}

const layoutSx: SxProps<Theme> = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, rgba(245,250,255,0.96), rgba(231,244,255,0.84) 42%, rgba(245,242,255,0.82) 72%, rgba(239,255,247,0.9))",
  "&::before": {
    content: '""',
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(100deg, rgba(255,255,255,0.72), transparent 28%, rgba(255,255,255,0.38) 48%, transparent 76%)",
    opacity: 0.72,
  },
};

export default function AppLayout({ user, setUser, children }: AppLayoutProps) {
  return (
    <Box sx={layoutSx}>
      <AppNavbar user={user} setUser={setUser} />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, py: { xs: 3, md: 5 } }}
      >
        {children}
      </Container>
    </Box>
  );
}
