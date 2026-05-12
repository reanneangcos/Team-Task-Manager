import { createTheme } from "@mui/material/styles";

const colors = {
  background: "#F5F5F7",
  surface: "#FFFFFF",
  panel: "#F2F2F7",
  header: "#050505",
  button: "#000000",
  buttonHover: "#1D1D1F",
  primary: "#111111",
  primaryHover: "#000000",
  accent: "#6E6E73",
  card: "#FFFFFF",
  border: "#D2D2D7",
  text: "#1D1D1F",
  muted: "#6E6E73",
  pending: "#F59E0B",
  inProgress: "#111111",
  completed: "#22C55E",
  urgent: "#EF4444",
  archived: "#8E8E93",
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.card,
    },
    secondary: {
      main: colors.accent,
    },
    success: {
      main: colors.completed,
    },
    warning: {
      main: colors.pending,
    },
    error: {
      main: colors.urgent,
    },
    background: {
      default: colors.background,
      paper: colors.card,
    },
    text: {
      primary: colors.text,
      secondary: colors.muted,
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
          color: colors.button,
          "&.MuiButton-contained": {
            color: colors.card,
            background: colors.button,
            border: `1px solid ${colors.button}`,
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
            "&:hover": {
              background: colors.buttonHover,
              boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)",
            },
          },
          "&.MuiButton-outlined": {
            color: colors.button,
            borderColor: colors.button,
            backgroundColor: "rgba(255, 255, 255, 0.72)",
            "&:hover": {
              borderColor: colors.button,
              backgroundColor: colors.panel,
            },
          },
          "&.MuiButton-text": {
            color: colors.button,
            "&:hover": {
              backgroundColor: colors.panel,
            },
          },
        },
        contained: {
          color: colors.card,
          background: colors.button,
          border: `1px solid ${colors.button}`,
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
        },
        outlined: {
          color: colors.button,
          borderColor: colors.button,
          backgroundColor: "rgba(255, 255, 255, 0.72)",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.archived,
          "&.Mui-checked": {
            color: colors.primary,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.button,
          "&.MuiIconButton-colorError": {
            color: colors.button,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          border: `1px solid ${colors.border}`,
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.07)",
          backdropFilter: "blur(24px) saturate(160%)",
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "& fieldset": {
              borderColor: colors.border,
            },
            "&:hover fieldset": {
              borderColor: colors.primary,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.primary,
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: colors.border,
          backdropFilter: "blur(22px) saturate(160%)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          color: colors.text,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(24px) saturate(160%)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
        },
      },
    },
  },
});

export default theme;
