import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import api from "../../api/axios";
import type { Task, User } from "../../types";
import LoadingScreen from "../../components/common/LoadingScreen";
import { getMediaUrl } from "../../utils/media";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        const [tasksResponse, employeesResponse] = await Promise.all([
          api.get<Task[]>("/tasks"),
          api.get<User[]>("/users"),
        ]);

        if (!active) {
          return;
        }

        setTasks(tasksResponse.data);
        setEmployees(employeesResponse.data);
      } catch {
        if (active) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  const toggleEmployee = (userId: number) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  };

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const activeTasks = tasks.filter((task) => task.status === "in_progress").length;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post<{ task: Task }>("/tasks", {
        ...form,
        user_ids: selectedUserIds,
      });

      setTasks((current) => [response.data.task, ...current]);
      setForm({ title: "", description: "" });
      setSelectedUserIds([]);
    } catch {
      setError("Unable to create task. Add a title, description, and assignee.");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: "8px",
          border: "1px solid #D2D2D7",
          backgroundColor: "#FFFFFF",
          backdropFilter: "blur(28px) saturate(170%)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" } }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Admin Dashboard
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Create tasks and assign them to employees.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {[
              ["Tasks", tasks.length],
              ["Active", activeTasks],
              ["Done", completedTasks],
              ["Employees", employees.length],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  minWidth: 92,
                  px: 1.5,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid #D2D2D7",
                  backgroundColor: "#F5F5F7",
                }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {label}
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.1, fontWeight: 900 }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card elevation={0}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.25}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <AssignmentRoundedIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 850 }}>
                  New Task
                </Typography>
              </Stack>
              <TextField
                label="Title"
                value={form.title}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Description"
                value={form.description}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                fullWidth
                multiline
                minRows={3}
              />

              <Box>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mb: 1 }}>
                  <GroupRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 780 }}>
                    Assign Employees
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {employees.map((employee) => (
                    <FormControlLabel
                      key={employee.id}
                      control={
                        <Checkbox
                          checked={selectedUserIds.includes(employee.id)}
                          disabled={employee.is_active === false}
                          onChange={() => toggleEmployee(employee.id)}
                          sx={{
                            color: "#8E8E93",
                            "&.Mui-checked": { color: "primary.main" },
                          }}
                        />
                      }
                      label={
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Avatar
                            src={getMediaUrl(employee.avatar_url)}
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 13,
                              fontWeight: 800,
                            }}
                          >
                            {employee.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {employee.name}
                          </Typography>
                          {employee.is_active === false && (
                            <Chip
                              size="small"
                              label="Inactive"
                              variant="outlined"
                              sx={{
                                height: 22,
                                color: "#991B1B",
                                borderColor: "#EF4444",
                                backgroundColor: "#FEF2F2",
                              }}
                            />
                          )}
                        </Stack>
                      }
                      sx={{
                        m: 0,
                        px: 1,
                        py: 0.25,
                        borderRadius: "999px",
                        backgroundColor: selectedUserIds.includes(employee.id)
                          ? "#F2F2F7"
                          : employee.is_active === false
                            ? "#F5F5F7"
                          : "#FFFFFF",
                        border: "1px solid #D2D2D7",
                        opacity: employee.is_active === false ? 0.72 : 1,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Button type="submit" variant="contained" startIcon={<AddRoundedIcon />}>
                Create Task
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {tasks.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          No tasks created yet.
        </Typography>
      )}
    </Stack>
  );
}
