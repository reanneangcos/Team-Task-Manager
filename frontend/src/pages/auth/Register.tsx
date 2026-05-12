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
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { AuthResponse, User } from "../../types";
import { saveAuth } from "../../utils/auth";

interface RegisterProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Register({ user, setUser }: RegisterProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post<AuthResponse>("/register", form);

      saveAuth(response.data.token, response.data.user);
      setUser(response.data.user);

      navigate("/employee");
    } catch {
      setError("Registration failed. Please check your details.");
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
        backgroundColor: "#F5F5F7",
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}>
        <Card
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(24px) saturate(160%)",
          }}
        >
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
                    color: "#FFFFFF",
                    background: "#000000",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.18)",
                  }}
                >
                  <AssignmentTurnedInIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                    Create account
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    New users are registered as employees.
                  </Typography>
                </Box>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}

              <Box component="form" onSubmit={handleRegister}>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={form.name}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeRoundedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={(event) => updateField("name", event.target.value)}
                  />

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
                    Register
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Already have an account? <Link to="/login">Login here</Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
