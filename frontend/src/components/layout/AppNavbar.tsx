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
  position: "relative",
  height: 40,
  px: 1.5,
  border: "0",
  borderRadius: "999px",
  background: "transparent !important",
  backgroundColor: "transparent !important",
  boxShadow: "none !important",
  color: "#FFFFFF",
  fontWeight: 800,
  minWidth: "auto",
  opacity: 0.72,
  transition:
    "opacity 180ms ease, color 180ms ease, transform 180ms ease",
  "&.MuiButton-root": {
    color: "#FFFFFF",
    background: "transparent !important",
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
  },
  "&.MuiButton-text, &.MuiButton-textPrimary": {
    color: "#FFFFFF",
    background: "transparent !important",
    backgroundColor: "transparent !important",
  },
  "&&:hover, &&:focus, &&:focus-visible, &&.Mui-focusVisible, &&:active": {
    background: "transparent !important",
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
    color: "#FFFFFF",
    opacity: 1,
    transform: "translateY(-1px)",
  },
  "&:hover": {
    background: "transparent !important",
    backgroundColor: "transparent !important",
    color: "#FFFFFF",
    opacity: 1,
    transform: "translateY(-1px)",
  },
  "& .MuiTouchRipple-root": {
    display: "none",
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
    opacity: location.pathname === path ? 1 : 0.72,
    "&::after": {
      content: '""',
      position: "absolute",
      left: "50%",
      bottom: 4,
      width: location.pathname === path ? 18 : 0,
      height: 2,
      borderRadius: "999px",
      backgroundColor: "#FFFFFF",
      transform: "translateX(-50%)",
      transition: "width 180ms ease",
    },
    "&:hover::after": {
      width: location.pathname === path ? 18 : 12,
      backgroundColor:
        location.pathname === path ? "#FFFFFF" : "rgba(255, 255, 255, 0.72)",
    },
  });

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        color: "#FFFFFF",
        px: { xs: 1.5, md: 3 },
        py: 1.5,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          width: "min(1180px, 100%)",
          minHeight: { xs: 64, md: 68 },
          mx: "auto",
          px: { xs: 1.25, md: 2 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          alignItems: "center",
          gap: 2,
          border: "1px solid rgba(255, 255, 255, 0.16)",
          borderRadius: "999px",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 44px rgba(0, 0, 0, 0.28)",
          backdropFilter: "blur(22px) saturate(170%)",
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
                  border: "1px solid transparent",
                  borderRadius: "999px",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  backdropFilter: "blur(18px) saturate(160%)",
                }}
              >
                <Button
                  disableRipple
                  startIcon={<DashboardRoundedIcon />}
                  sx={getNavButtonSx("/admin")}
                  onClick={() => navigate("/admin")}
                >
                  Dashboard
                </Button>

                <Button
                  disableRipple
                  startIcon={<AssignmentRoundedIcon />}
                  sx={getNavButtonSx("/admin/tasks")}
                  onClick={() => navigate("/admin/tasks")}
                >
                  Tasks
                </Button>
                <Button
                  disableRipple
                  startIcon={<PeopleRoundedIcon />}
                  sx={getNavButtonSx("/admin/employees")}
                  onClick={() => navigate("/admin/employees")}
                >
                  Employees
                </Button>
              </Stack>
            )}

            {user.role === "employee" && (
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
                  border: "1px solid transparent",
                  borderRadius: "999px",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  backdropFilter: "blur(18px) saturate(160%)",
                }}
              >
                <Button
                  disableRipple
                  startIcon={<AssignmentRoundedIcon />}
                  sx={getNavButtonSx("/employee/tasks")}
                  onClick={() => navigate("/employee/tasks")}
                >
                  Tasks
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
