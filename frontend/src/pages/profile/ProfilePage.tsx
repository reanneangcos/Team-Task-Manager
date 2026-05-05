import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import api from "../../api/axios";
import type { ProfileResponse, User } from "../../types";
import { saveAuth } from "../../utils/auth";

interface ProfilePageProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function ProfilePage({ user, setUser }: ProfilePageProps) {
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("email", form.email);

    if (form.password) {
      payload.append("password", form.password);
    }

    if (profilePhoto) {
      payload.append("profile_photo", profilePhoto);
    }

    try {
      const response = await api.patch<ProfileResponse>(
        `/profile/${user.id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const token = localStorage.getItem("token") ?? "";

      saveAuth(token, response.data.user);
      setUser(response.data.user);
      setForm((current) => ({ ...current, password: "" }));
      setMessage("Profile updated successfully.");
    } catch {
      setError("Unable to update profile.");
    }
  };

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.72)",
          backgroundColor: "rgba(255, 255, 255, 0.48)",
          backdropFilter: "blur(28px) saturate(170%)",
          boxShadow: "0 24px 60px rgba(64, 100, 148, 0.13)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Profile
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Update your account details and avatar.
        </Typography>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Card elevation={0}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.25}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
              >
                <Avatar
                  src={user.avatar_url || ""}
                  sx={{
                    width: 72,
                    height: 72,
                    border: "3px solid rgba(255,255,255,0.88)",
                    boxShadow: "0 16px 34px rgba(0,122,255,0.2)",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 850 }}>{user.name}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {profilePhoto?.name ?? user.email}
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadRoundedIcon />}
                  sx={{ ml: { sm: "auto" } }}
                >
                  Upload Photo
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) =>
                      setProfilePhoto(event.target.files?.[0] ?? null)
                    }
                  />
                </Button>
              </Stack>

              <TextField
                label="Name"
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
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
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
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="New password"
                type="password"
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
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                fullWidth
              />

              <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />}>
                Save Profile
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
