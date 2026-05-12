import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import api from "../../api/axios";
import LoadingScreen from "../../components/common/LoadingScreen";
import StatusChip from "../../components/tasks/StatusChip";
import type { Task, TaskStatus, User } from "../../types";
import { getMediaUrl } from "../../utils/media";

interface EmployeeTasksPageProps {
  user: User | null;
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function EmployeeTasksPage({ user }: EmployeeTasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<number | false>(false);
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
        setExpandedTaskId(response.data[0]?.id ?? false);
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
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
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
              Task List
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Expand a task to review details and update progress.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {[
              ["Assigned", tasks.length],
              ["Pending", pendingTasks],
              ["Active", activeTasks],
              ["Done", completedTasks],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  minWidth: 88,
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

      <Stack spacing={1.5}>
        {tasks.map((task) => {
          const creator = task.creator;
          const assignedUsers = task.users ?? [];

          return (
            <Accordion
              key={task.id}
              disableGutters
              expanded={expandedTaskId === task.id}
              onChange={(_, expanded) => setExpandedTaskId(expanded ? task.id : false)}
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                boxShadow: "none",
                overflow: "hidden",
                "&::before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.25}
                  sx={{
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    width: "100%",
                    pr: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 850 }} noWrap>
                      {task.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Task #{task.id} • Created {formatDateTime(task.created_at)}
                    </Typography>
                  </Box>
                  <StatusChip status={task.status} />
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={2.25}>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                    {task.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    <Chip label={`Created ${formatDateTime(task.created_at)}`} />
                    <Chip label={`Updated ${formatDateTime(task.updated_at)}`} />
                  </Stack>

                  {creator && (
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <ManageAccountsRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
                      <Avatar
                        src={getMediaUrl(creator.avatar_url)}
                        sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 800 }}
                      >
                        {creator.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1 }}>
                          Created by
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 780, lineHeight: 1.2 }}>
                          {creator.name}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {assignedUsers.length > 0 && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F8FAFC",
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
                      >
                        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                          <GroupsRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 780 }}>
                            Assigned Users
                          </Typography>
                        </Stack>

                        <AvatarGroup max={5}>
                          {assignedUsers.map((assignedUser) => (
                            <Avatar
                              key={assignedUser.id}
                              src={getMediaUrl(assignedUser.avatar_url)}
                              sx={{ width: 32, height: 32, fontSize: 14 }}
                            >
                              {assignedUser.name.charAt(0).toUpperCase()}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </Stack>

                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                        {assignedUsers.map((assignedUser) => assignedUser.name).join(", ")}
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<PlayArrowRoundedIcon />}
                      disabled={task.status === "in_progress"}
                      onClick={() => handleStatusChange(task.id, "in_progress")}
                    >
                      Start
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<CheckCircleRoundedIcon />}
                      disabled={task.status === "completed"}
                      onClick={() => handleStatusChange(task.id, "completed")}
                    >
                      Complete
                    </Button>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      {tasks.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          No tasks assigned yet.
        </Typography>
      )}
    </Stack>
  );
}
