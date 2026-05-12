import { Chip } from "@mui/material";
import type { TaskStatus } from "../../types";

interface StatusChipProps {
  status: TaskStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const statusColors = {
    pending: "#F59E0B",
    inProgress: "#111111",
    completed: "#22C55E",
    urgent: "#EF4444",
    archived: "#8E8E93",
  };

  const getLabel = () => {
    if (status === "in_progress") return "In Progress";
    if (status === "completed") return "Completed";
    return "Pending";
  };

  const getStyle = () => {
    if (status === "completed") {
      return {
        color: statusColors.completed,
        backgroundColor: "#F0FDF4",
        borderColor: statusColors.completed,
      };
    }

    if (status === "in_progress") {
      return {
        color: statusColors.inProgress,
        backgroundColor: "#F2F2F7",
        borderColor: statusColors.inProgress,
      };
    }

    return {
      color: statusColors.pending,
      backgroundColor: "#FFFBEB",
      borderColor: statusColors.pending,
    };
  };

  return (
    <Chip
      label={getLabel()}
      size="small"
      variant="outlined"
      sx={{
        ...getStyle(),
        minWidth: 92,
      }}
    />
  );
}
