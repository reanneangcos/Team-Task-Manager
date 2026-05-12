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
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { clearAuth } from "../../utils/auth";
import { getMediaUrl } from "../../utils/media";

const navActionSize = 48;

const navButtonSx = {
  height: 40,
  px: 1.5,
  border: "0",
  borderRadius: "999px",
  backgroundColor: "transparent",
  color: "#FFFFFF",
  fontWeight: 800,
  minWidth: "auto",
  "&.MuiButton-root": {
    color: "#FFFFFF",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
  },
  "& .MuiButton-startIcon": {
    color: "#FFFFFF",
    mr: 0.75,
  },
};

interface AppNavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function AppNavbar({ user, setUser }: AppNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavButtonSx = (path: string) => ({
    ...navButtonSx,
    backgroundColor:
      location.pathname === path ? "rgba(255, 255, 255, 0.16)" : "transparent",
    boxShadow:
      location.pathname === path
        ? "inset 0 1px 0 rgba(255, 255, 255, 0.12)"
        : "none",
  });

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
        color: "#FFFFFF",
        borderBottom: "1px solid rgba(255, 255, 255, 0.14)",
        backgroundColor: "#000000",
        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.28)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 68, md: 74 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          alignItems: "center",
          gap: 2,
          px: { xs: 2, md: 3 },
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              borderRadius: 1,
              color: "#000000",
              backgroundColor: "#FFFFFF",
            }}
          >
            <AssignmentTurnedInIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.1, color: "#FFFFFF" }}>
              Team Task Manager
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.62)" }}>
              Workspace
            </Typography>
          </Box>
        </Stack>

        {user && (
          <>
            {user.role === "admin" && (
              <Stack
                direction="row"
                spacing={0.25}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gridColumn: { xs: "1", md: "2" },
                  justifySelf: "center",
                  p: 0.5,
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 12px 28px rgba(0, 0, 0, 0.28)",
                  backdropFilter: "blur(18px) saturate(160%)",
                }}
              >
                <Button
                  startIcon={<DashboardRoundedIcon />}
                  sx={getNavButtonSx("/admin")}
                  onClick={() => navigate("/admin")}
                >
                  Dashboard
                </Button>

                <Button
                  startIcon={<AssignmentRoundedIcon />}
                  sx={getNavButtonSx("/admin/tasks")}
                  onClick={() => navigate("/admin/tasks")}
                >
                  Tasks
                </Button>
                <Button
                  startIcon={<PeopleRoundedIcon />}
                  sx={getNavButtonSx("/admin/employees")}
                  onClick={() => navigate("/admin/employees")}
                >
                  Employees
                </Button>
              </Stack>
            )}

          <Stack
            direction="row"
            spacing={{ xs: 0.75, md: 1.25 }}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gridColumn: { xs: "1", md: "3" },
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                height: navActionSize,
                px: 0.5,
                border: "0",
                backgroundColor: "transparent",
                color: "#FFFFFF",
                cursor: "pointer",
                font: "inherit",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "rgba(255, 255, 255, 0.78)",
                },
              }}
            >
              <Avatar
                src={getMediaUrl(user.avatar_url)}
                sx={{
                  width: 32,
                  height: 32,
                  background: "#FFFFFF",
                  color: "#000000",
                  fontWeight: 800,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
            </Box>

            <IconButton
              aria-label="Logout"
              onClick={handleLogout}
              sx={{
                width: navActionSize,
                height: navActionSize,
                backgroundColor: "transparent",
                border: "0",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "rgba(255, 255, 255, 0.78)",
                },
              }}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Stack>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
