import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import type { Task, TaskStatus } from "../../types";
import StatusChip from "./StatusChip";

interface TaskCardProps {
  task: Task;
  showAssignees?: boolean;
  onStatusChange?: (taskId: number, status: TaskStatus) => void;
}

export default function TaskCard({
  task,
  showAssignees = true,
  onStatusChange,
}: TaskCardProps) {
  const assignedUsers = task.users ?? [];

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 0 auto",
          height: 3,
          background:
            task.status === "completed"
              ? "linear-gradient(90deg, #34c759, #30d158)"
              : task.status === "in_progress"
                ? "linear-gradient(90deg, #ff9f0a, #ffd60a)"
                : "linear-gradient(90deg, #8e8e93, #64d2ff)",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 28px 64px rgba(64, 100, 148, 0.22), inset 0 1px 0 rgba(255,255,255,0.84)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.25}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 850, lineHeight: 1.18 }}>
                {task.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Task #{task.id}
              </Typography>
            </Box>

            <StatusChip status={task.status} />
          </Stack>

          <Typography sx={{ color: "text.secondary", lineHeight: 1.65 }}>
            {task.description}
          </Typography>

          {showAssignees && assignedUsers.length > 0 && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.72)",
                backgroundColor: "rgba(255,255,255,0.42)",
              }}
            >
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
              >
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <GroupsRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 780 }}>
                    Assigned Employees
                  </Typography>
                </Stack>

                <AvatarGroup
                  max={5}
                  sx={{
                    justifyContent: "flex-end",
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      fontSize: 14,
                      border: "2px solid rgba(255,255,255,0.82)",
                    },
                  }}
                >
                  {assignedUsers.map((user) => (
                    <Avatar key={user.id} src={user.avatar_url || ""}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {assignedUsers.map((user) => user.name).join(", ")}
              </Typography>
            </Box>
          )}

          {onStatusChange && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<PlayArrowRoundedIcon />}
                disabled={task.status === "in_progress"}
                onClick={() => onStatusChange(task.id, "in_progress")}
              >
                Start
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleRoundedIcon />}
                disabled={task.status === "completed"}
                onClick={() => onStatusChange(task.id, "completed")}
              >
                Complete
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
