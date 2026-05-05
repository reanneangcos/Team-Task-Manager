import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
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
import TaskCard from "../../components/tasks/TaskCard";

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
          border: "1px solid rgba(255, 255, 255, 0.72)",
          backgroundColor: "rgba(255, 255, 255, 0.48)",
          backdropFilter: "blur(28px) saturate(170%)",
          boxShadow: "0 24px 60px rgba(64, 100, 148, 0.13)",
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
                  border: "1px solid rgba(255,255,255,0.72)",
                  backgroundColor: "rgba(255,255,255,0.5)",
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
                          onChange={() => toggleEmployee(employee.id)}
                          sx={{
                            color: "rgba(0,122,255,0.46)",
                            "&.Mui-checked": { color: "primary.main" },
                          }}
                        />
                      }
                      label={employee.name}
                      sx={{
                        m: 0,
                        px: 1,
                        py: 0.25,
                        borderRadius: "999px",
                        backgroundColor: selectedUserIds.includes(employee.id)
                          ? "rgba(0,122,255,0.12)"
                          : "rgba(255,255,255,0.42)",
                        border: "1px solid rgba(255,255,255,0.62)",
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

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid key={task.id} size={{ xs: 12, md: 6 }}>
            <TaskCard task={task} />
          </Grid>
        ))}
      </Grid>

      {tasks.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          No tasks created yet.
        </Typography>
      )}
    </Stack>
  );
}
