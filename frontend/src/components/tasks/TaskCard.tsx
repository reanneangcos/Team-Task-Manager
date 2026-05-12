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
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import type { Task, TaskStatus } from "../../types";
import { getMediaUrl } from "../../utils/media";
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
  const creator = task.creator;

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
              ? "#22C55E"
              : task.status === "in_progress"
                ? "#3B82F6"
                : "#F59E0B",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 16px 36px rgba(15, 23, 42, 0.1)",
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

          {creator && (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ManageAccountsRoundedIcon sx={{ color: "primary.main", fontSize: 18 }} />
              <Avatar
                src={getMediaUrl(creator.avatar_url)}
                sx={{ width: 30, height: 30, fontSize: 13, fontWeight: 800 }}
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

          {showAssignees && assignedUsers.length > 0 && (
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
                      border: "2px solid #FFFFFF",
                    },
                  }}
                >
                  {assignedUsers.map((user) => (
                    <Avatar key={user.id} src={getMediaUrl(user.avatar_url)}>
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
