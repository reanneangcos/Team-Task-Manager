import { useEffect, useState } from "react";
import type { DragEvent } from "react";
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

const getColumnIdForStatus = (status: TaskStatus) => {
  if (status === "in_progress") {
    return "active";
  }

  if (status === "completed") {
    return "done";
  }

  return "pending";
};

export default function EmployeeTasksPage({ user }: EmployeeTasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | false>(false);
  const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [statusUpdatingTaskId, setStatusUpdatingTaskId] = useState<number | null>(null);
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
        const firstTask = response.data[0];

        setTasks(response.data);
        setExpandedTaskId(
          firstTask ? `${getColumnIdForStatus(firstTask.status)}-${firstTask.id}` : false,
        );
      } catch {
        setError("Unable to load your tasks.");
      } finally {
        setLoading(false);
      }
    };

    void fetchTasks();
  }, [user]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    const currentTask = tasks.find((task) => task.id === taskId);

    if (currentTask?.status === status) {
      return;
    }

    setError("");
    setStatusUpdatingTaskId(taskId);

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
    } finally {
      setStatusUpdatingTaskId(null);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, taskId: number) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(taskId));
    setDraggingTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (
    event: DragEvent<HTMLDivElement>,
    columnId: string,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleColumnDrop = async (
    event: DragEvent<HTMLDivElement>,
    status: TaskStatus,
  ) => {
    event.preventDefault();
    setDragOverColumn(null);

    const droppedTaskId = Number(event.dataTransfer.getData("text/plain")) || draggingTaskId;

    if (!droppedTaskId) {
      setDraggingTaskId(null);
      return;
    }

    await handleStatusChange(droppedTaskId, status);
    setDraggingTaskId(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const activeTasks = tasks.filter((task) => task.status === "in_progress").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const taskColumns = [
    {
      id: "pending",
      title: "Pending",
      count: pendingTasks,
      items: tasks.filter((task) => task.status === "pending"),
      status: "pending" as TaskStatus,
      emptyText: "No pending tasks.",
    },
    {
      id: "active",
      title: "Active",
      count: activeTasks,
      items: tasks.filter((task) => task.status === "in_progress"),
      status: "in_progress" as TaskStatus,
      emptyText: "No active tasks.",
    },
    {
      id: "done",
      title: "Done",
      count: completedTasks,
      items: tasks.filter((task) => task.status === "completed"),
      status: "completed" as TaskStatus,
      emptyText: "No completed tasks.",
    },
  ];

  const renderTaskCard = (task: Task, columnId: string) => {
    const creator = task.creator;
    const assignedUsers = task.users ?? [];
    const expandedKey = `${columnId}-${task.id}`;

    return (
      <Accordion
        key={expandedKey}
        disableGutters
        draggable
        expanded={expandedTaskId === expandedKey}
        onDragStart={(event) => handleDragStart(event, task.id)}
        onDragEnd={handleDragEnd}
        onChange={(_, expanded) => setExpandedTaskId(expanded ? expandedKey : false)}
        sx={{
          border: "1px solid #D2D2D7",
          borderRadius: "8px",
          boxShadow: "none",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          cursor: "grab",
          opacity: draggingTaskId === task.id ? 0.48 : 1,
          transition: "opacity 160ms ease, border-color 160ms ease",
          "&:active": {
            cursor: "grabbing",
          },
          "&:hover": {
            borderColor: "#111111",
          },
          "&::before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreRoundedIcon sx={{ fontSize: 22 }} />}
          sx={{
            minHeight: 64,
            px: 1.5,
            "& .MuiAccordionSummary-content": {
              my: 1,
              minWidth: 0,
            },
          }}
        >
          <Stack spacing={1} sx={{ width: "100%", pr: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
                minWidth: 0,
              }}
            >
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
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 1.5, pt: 0.5, pb: 1.5 }}>
          <Stack spacing={1.5}>
            <Typography sx={{ color: "#1D1D1F", fontWeight: 500, lineHeight: 1.55 }}>
              {task.description}
            </Typography>

            <Stack
              spacing={0.5}
              sx={{
                p: 1.25,
                borderRadius: "8px",
                backgroundColor: "#F5F5F7",
                border: "1px solid #E5E5EA",
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 750 }}>
                Created
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 760, lineHeight: 1.25 }}>
                {formatDateTime(task.created_at)}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 750, mt: 0.75 }}
              >
                Updated
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 760, lineHeight: 1.25 }}>
                {formatDateTime(task.updated_at)}
              </Typography>
            </Stack>

            {creator && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                <Avatar
                  src={getMediaUrl(creator.avatar_url)}
                  sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 800 }}
                >
                  {creator.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1 }}>
                    Created by
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 780, lineHeight: 1.2 }} noWrap>
                    {creator.name}
                  </Typography>
                </Box>
              </Stack>
            )}

            {assignedUsers.length > 0 && (
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: "8px",
                  border: "1px solid #D2D2D7",
                  backgroundColor: "#F5F5F7",
                }}
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
                  >
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", minWidth: 0 }}>
                      <GroupsRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 780 }}>
                        Assigned Users
                      </Typography>
                    </Stack>

                    <AvatarGroup
                      max={4}
                      sx={{
                        flexShrink: 0,
                        "& .MuiAvatar-root": {
                          width: 28,
                          height: 28,
                          fontSize: 13,
                          border: "2px solid #F5F5F7",
                        },
                      }}
                    >
                      {assignedUsers.map((assignedUser) => (
                        <Avatar
                          key={assignedUser.id}
                          src={getMediaUrl(assignedUser.avatar_url)}
                        >
                          {assignedUser.name.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Stack>

                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.45 }}>
                    {assignedUsers.map((assignedUser) => assignedUser.name).join(", ")}
                  </Typography>
                </Stack>
              </Box>
            )}

            <Divider />

            <Stack direction="column" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<PlayArrowRoundedIcon />}
                disabled={task.status === "in_progress" || statusUpdatingTaskId === task.id}
                draggable={false}
                size="small"
                onClick={() => handleStatusChange(task.id, "in_progress")}
                sx={{ width: "100%" }}
              >
                {statusUpdatingTaskId === task.id ? "Updating..." : "Start"}
              </Button>

              <Button
                variant="contained"
                startIcon={<CheckCircleRoundedIcon />}
                disabled={task.status === "completed" || statusUpdatingTaskId === task.id}
                draggable={false}
                size="small"
                onClick={() => handleStatusChange(task.id, "completed")}
                sx={{ width: "100%" }}
              >
                {statusUpdatingTaskId === task.id ? "Updating..." : "Complete"}
              </Button>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  };

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
              Task List
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Drag tasks into Pending, Active, or Done to update their status.
            </Typography>
          </Box>
          <Box
            sx={{
              minWidth: 132,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              border: "1px solid #D2D2D7",
              backgroundColor: "#F5F5F7",
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 750 }}>
              Assigned
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.1, fontWeight: 900 }}>
              {tasks.length}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {taskColumns.map((column) => (
          <Box
            key={column.id}
            onDragOver={(event) => handleColumnDragOver(event, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(event) => void handleColumnDrop(event, column.status)}
            sx={{
              minHeight: 280,
              p: 1.25,
              borderRadius: "8px",
              border:
                dragOverColumn === column.id
                  ? "1px solid #111111"
                  : "1px solid #D2D2D7",
              backgroundColor:
                dragOverColumn === column.id
                  ? "rgba(242, 242, 247, 0.96)"
                  : "rgba(255, 255, 255, 0.72)",
              backdropFilter: "blur(18px) saturate(160%)",
              transition: "background-color 160ms ease, border-color 160ms ease",
            }}
          >
            <Stack spacing={1.25}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
              >
                <Typography sx={{ fontWeight: 900 }}>{column.title}</Typography>
                <Chip size="small" label={column.count} />
              </Stack>

              <Stack spacing={1.25}>
                {column.items.map((task) => renderTaskCard(task, column.id))}
              </Stack>

              {column.items.length === 0 && (
                <Box
                  sx={{
                    minHeight: 104,
                    display: "grid",
                    placeItems: "center",
                    px: 1.5,
                    borderRadius: "8px",
                    border: "1px dashed #D2D2D7",
                    backgroundColor: "#F5F5F7",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {column.emptyText}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        ))}
      </Box>

      {tasks.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          No tasks assigned yet.
        </Typography>
      )}
    </Stack>
  );
}
