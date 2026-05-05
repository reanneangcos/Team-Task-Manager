import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { AuthResponse, User } from "../../types";
import { saveAuth } from "../../utils/auth";

interface LoginProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Login({ user, setUser }: LoginProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const updateField = (field: "email" | "password", value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post<AuthResponse>("/login", form);
      const nextUser = response.data.user;

      saveAuth(response.data.token, nextUser);
      setUser(nextUser);
      navigate(nextUser.role === "admin" ? "/admin" : "/employee");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/employee"} replace />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 6,
        background:
          "linear-gradient(145deg, rgba(248,251,255,0.96), rgba(229,244,255,0.88) 42%, rgba(246,242,255,0.9) 72%, rgba(239,255,247,0.92))",
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}>
        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "8px",
                    color: "white",
                    background:
                      "linear-gradient(135deg, rgba(0,122,255,0.98), rgba(52,199,89,0.9))",
                    boxShadow: "0 16px 34px rgba(0,122,255,0.24)",
                  }}
                >
                  <AssignmentTurnedInIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                    Welcome back
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Sign in to manage your team tasks.
                  </Typography>
                </Box>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={form.email}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailRoundedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={form.password}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardRoundedIcon />}
                  >
                    Login
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Need an account? <Link to="/register">Register here</Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
