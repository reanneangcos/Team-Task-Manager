import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { clearAuth } from "../../utils/auth";

interface AppNavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function AppNavbar({ user, setUser }: AppNavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 10,
        color: "text.primary",
        borderBottom: "1px solid rgba(255, 255, 255, 0.58)",
        backgroundColor: "rgba(248, 251, 255, 0.64)",
        backdropFilter: "blur(28px) saturate(180%)",
        boxShadow: "0 20px 50px rgba(63, 94, 140, 0.12)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 72, md: 78 },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              display: "grid",
              placeItems: "center",
              borderRadius: "8px",
              color: "white",
              background:
                "linear-gradient(135deg, rgba(0,122,255,0.98), rgba(52,199,89,0.9))",
              boxShadow: "0 14px 30px rgba(0, 122, 255, 0.24)",
            }}
          >
            <AssignmentTurnedInIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Team Task Manager
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Liquid workspace
            </Typography>
          </Box>
        </Stack>

        {user && (
          <Stack
            direction="row"
            spacing={{ xs: 0.75, md: 1.25 }}
            sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}
          >
            <Button
              startIcon={<DashboardRoundedIcon />}
              onClick={() =>
                navigate(user.role === "admin" ? "/admin" : "/employee")
              }
            >
              Dashboard
            </Button>

            <Button startIcon={<PersonRoundedIcon />} onClick={() => navigate("/profile")}>
              Profile
            </Button>

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderRadius: "999px",
                border: "1px solid rgba(255, 255, 255, 0.72)",
                backgroundColor: "rgba(255, 255, 255, 0.52)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.82)",
              }}
            >
              <Avatar src={user.avatar_url || ""} sx={{ width: 32, height: 32 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
            </Box>

            <IconButton
              aria-label="Logout"
              color="error"
              onClick={handleLogout}
              sx={{
                border: "1px solid rgba(255, 59, 48, 0.22)",
                backgroundColor: "rgba(255, 255, 255, 0.54)",
                backdropFilter: "blur(16px)",
              }}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
