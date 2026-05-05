import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007aff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#34c759",
    },
    success: {
      main: "#34c759",
    },
    warning: {
      main: "#ff9f0a",
    },
    error: {
      main: "#ff3b30",
    },
    background: {
      default: "#eef5ff",
      paper: "rgba(255, 255, 255, 0.72)",
    },
    text: {
      primary: "#172033",
      secondary: "#647184",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif',
    allVariants: {
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 850,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 820,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 780,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 760,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 999,
          textTransform: "none",
          boxShadow: "none",
        },
        contained: {
          background:
            "linear-gradient(135deg, rgba(0,122,255,0.98), rgba(48,176,199,0.96))",
          boxShadow: "0 12px 30px rgba(0, 122, 255, 0.24)",
          "&:hover": {
            boxShadow: "0 16px 34px rgba(0, 122, 255, 0.28)",
          },
        },
        outlined: {
          borderColor: "rgba(0, 122, 255, 0.26)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(18px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.68)",
          border: "1px solid rgba(255, 255, 255, 0.72)",
          boxShadow:
            "0 24px 60px rgba(64, 100, 148, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(28px) saturate(170%)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 760,
          backdropFilter: "blur(14px)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.56)",
            backdropFilter: "blur(18px)",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          background:
            "linear-gradient(135deg, rgba(0,122,255,0.94), rgba(52,199,89,0.9))",
        },
      },
    },
  },
});

export default theme;
