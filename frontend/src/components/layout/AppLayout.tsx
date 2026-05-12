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
  background: "#F5F5F7",
  "&::before": {
    content: '""',
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0) 44%)",
    opacity: 1,
  },
};

export default function AppLayout({ user, setUser, children }: AppLayoutProps) {
  return (
    <Box sx={layoutSx}>
      <AppNavbar user={user} setUser={setUser} />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 12, md: 13 },
          pb: { xs: 3, md: 5 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
