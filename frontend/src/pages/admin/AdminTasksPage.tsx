import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import api from "../../api/axios";
import LoadingScreen from "../../components/common/LoadingScreen";
import StatusChip from "../../components/tasks/StatusChip";
import type { Task, TaskStatus, User } from "../../types";
import { getMediaUrl } from "../../utils/media";

const statusOptions: TaskStatus[] = ["pending", "in_progress", "completed"];

const getStatusLabel = (status: TaskStatus) => {
  if (status === "in_progress") {
    return "In Progress";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Pending";
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending" as TaskStatus,
    userIds: [] as number[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchTasks = async () => {
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
        setSelectedTaskId(tasksResponse.data[0]?.id ?? null);
      } catch {
        if (active) {
          setError("Unable to load tasks.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchTasks();

    return () => {
      active = false;
    };
  }, []);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  useEffect(() => {
    if (!selectedTask) {
      setForm({
        title: "",
        description: "",
        status: "pending",
        userIds: [],
      });
      return;
    }

    setForm({
      title: selectedTask.title,
      description: selectedTask.description,
      status: selectedTask.status,
      userIds: selectedTask.users?.map((user) => user.id) ?? [],
    });
    setMessage("");
    setError("");
  }, [selectedTask]);

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const activeTasks = tasks.filter((task) => task.status === "in_progress").length;

  const toggleEmployee = (userId: number) => {
    setForm((current) => ({
      ...current,
      userIds: current.userIds.includes(userId)
        ? current.userIds.filter((id) => id !== userId)
        : [...current.userIds, userId],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTask) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.patch<{ task: Task }>(`/tasks/${selectedTask.id}`, {
        title: form.title,
        description: form.description,
        status: form.status,
        user_ids: form.userIds,
      });

      setTasks((current) =>
        current.map((task) =>
          task.id === selectedTask.id ? response.data.task : task,
        ),
      );
      setMessage("Task updated successfully.");
    } catch {
      setError("Unable to update task. Check the task details and assignees.");
    } finally {
      setSaving(false);
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
              Tasks
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Review task details, assignees, and status.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip icon={<AssignmentRoundedIcon />} label={`${tasks.length} Tasks`} />
            <Chip icon={<EditRoundedIcon />} label={`${activeTasks} Active`} />
            <Chip icon={<CheckCircleRoundedIcon />} label={`${completedTasks} Done`} />
          </Stack>
        </Stack>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1}>
                {tasks.map((task) => {
                  const selected = task.id === selectedTaskId;

                  return (
                    <ButtonBase
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        p: 1.25,
                        borderRadius: "8px",
                        border: selected ? "1px solid #111111" : "1px solid #D2D2D7",
                        backgroundColor: selected ? "#F2F2F7" : "#FFFFFF",
                        textAlign: "left",
                      }}
                    >
                      <Stack spacing={1} sx={{ width: "100%" }}>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", gap: 1 }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 850 }} noWrap>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Task #{task.id}
                            </Typography>
                          </Box>
                          <StatusChip status={task.status} />
                        </Stack>
                        <Typography variant="body2" sx={{ color: "#1D1D1F", fontWeight: 500 }} noWrap>
                          {task.description}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  );
                })}
              </Stack>

              {tasks.length === 0 && (
                <Typography sx={{ color: "text.secondary" }}>
                  No tasks created yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              {selectedTask ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.25}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <EditRoundedIcon sx={{ color: "primary.main" }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 850 }}>
                          Edit Task
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Task #{selectedTask.id}
                        </Typography>
                      </Box>
                    </Stack>

                    <TextField
                      label="Title"
                      value={form.title}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, title: event.target.value }))
                      }
                      fullWidth
                    />

                    <TextField
                      label="Description"
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, description: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={4}
                    />

                    <FormControl fullWidth>
                      <InputLabel id="task-status-label">Status</InputLabel>
                      <Select
                        labelId="task-status-label"
                        label="Status"
                        value={form.status}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            status: event.target.value as TaskStatus,
                          }))
                        }
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status} value={status}>
                            {getStatusLabel(status)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box>
                      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mb: 1 }}>
                        <GroupRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 780 }}>
                          Assignees
                        </Typography>
                      </Stack>
                      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                        {employees.map((employee) => (
                          <FormControlLabel
                            key={employee.id}
                            control={
                              <Checkbox
                                checked={form.userIds.includes(employee.id)}
                                disabled={
                                  employee.is_active === false &&
                                  !form.userIds.includes(employee.id)
                                }
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
                                  sx={{ width: 28, height: 28, fontSize: 13, fontWeight: 800 }}
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
                              backgroundColor: form.userIds.includes(employee.id)
                                ? "#F2F2F7"
                                : employee.is_active === false
                                  ? "#F5F5F7"
                                : "#FFFFFF",
                              border: "1px solid #D2D2D7",
                              opacity:
                                employee.is_active === false &&
                                !form.userIds.includes(employee.id)
                                  ? 0.72
                                  : 1,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Task"}
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  Select a task to view and edit its information.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
