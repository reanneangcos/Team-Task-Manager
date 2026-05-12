import { useEffect, useState } from "react";
import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import api from "../../api/axios";
import type { Task, TaskStatus, User } from "../../types";
import LoadingScreen from "../../components/common/LoadingScreen";
import TaskCard from "../../components/tasks/TaskCard";

interface EmployeeDashboardProps {
  user: User | null;
}

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get<Task[]>(`/my-tasks/${user.id}`);
        setTasks(response.data);
      } catch {
        setError("Unable to load your tasks.");
      } finally {
        setLoading(false);
      }
    };

    void fetchTasks();
  }, [user]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    setError("");

    try {
      const response = await api.patch<{ task: Task }>(
        `/tasks/${taskId}/status`,
        { status },
      );

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? response.data.task : task,
        ),
      );
    } catch {
      setError("Unable to update task status.");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const activeTasks = tasks.filter((task) => task.status === "in_progress").length;

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
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
              My Tasks
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Track your assigned work and update task progress.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {[
              ["Assigned", tasks.length],
              ["Active", activeTasks],
              ["Done", completedTasks],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  minWidth: 96,
                  px: 1.5,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
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

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid key={task.id} size={{ xs: 12, md: 6 }}>
            <TaskCard
              task={task}
              onStatusChange={handleStatusChange}
            />
          </Grid>
        ))}
      </Grid>

      {tasks.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          No tasks assigned yet.
        </Typography>
      )}
    </Stack>
  );
}
