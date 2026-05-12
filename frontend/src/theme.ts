import { createTheme } from "@mui/material/styles";

const colors = {
  background: "#F8FAFC",
  header: "#0F172A",
  button: "#000000",
  buttonHover: "#111827",
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  accent: "#38BDF8",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
  pending: "#F59E0B",
  inProgress: "#3B82F6",
  completed: "#22C55E",
  urgent: "#EF4444",
  archived: "#94A3B8",
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
            border: `1px solid ${colors.card}`,
            boxShadow: "none",
           
          },
          "&.MuiButton-outlined": {
            color: colors.button,
            borderColor: colors.button,
            backgroundColor: colors.card,
            
          },
          "&.MuiButton-text": {
            color: colors.button,
           
          },
        },
        contained: {
          color: colors.card,
          background: colors.button,
          border: `1px solid ${colors.card}`,
          boxShadow: "none",
         
        },
        outlined: {
          color: colors.button,
          borderColor: colors.button,
          backgroundColor: colors.card,
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
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
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
            backgroundColor: colors.card,
            "& fieldset": {
              borderColor: colors.border,
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          background:
            `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
        },
      },
    },
  },
});

export default theme;
