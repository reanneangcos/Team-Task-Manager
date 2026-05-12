import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import api from "../../api/axios";
import type { AuthResponse, User } from "../../types";
import { saveAuth } from "../../utils/auth";

interface LoginProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Login({ user, setUser }: LoginProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@example.com",
    password: "password",
  });

  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post<AuthResponse>("/login", form);

      saveAuth(response.data.token, response.data.user);
      setUser(response.data.user);

      navigate(response.data.user.role === "admin" ? "/admin" : "/employee/tasks");
    } catch (loginError) {
      if (isAxiosError<{ errors?: Record<string, string[]>; message?: string }>(loginError)) {
        const apiMessage =
          loginError.response?.data.errors?.email?.[0] ??
          loginError.response?.data.message;

        setError(apiMessage ?? "Login failed. Please check your email and password.");
        return;
      }

      setError("Login failed. Please check your email and password.");
    }
  };

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/employee/tasks"} replace />
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
            border: "1px solid #D2D2D7",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(24px) saturate(160%)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.7rem", fontWeight: 900 }}>
                Welcome back
              </Typography>
              <Typography color="text.secondary">
                Login to manage your tasks.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={2}>
                <TextField
                  sx={{ ml: "2px" }}
                  label="Email"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                />

                <Button type="submit" variant="contained" size="large">
                  Login
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2">
              No account yet? <Link to="/register">Register here</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
}
