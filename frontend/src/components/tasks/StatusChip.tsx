import { Chip } from "@mui/material";
import type { TaskStatus } from "../../types";

interface StatusChipProps {
  status: TaskStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const getLabel = () => {
    if (status === "in_progress") return "In Progress";
    if (status === "completed") return "Completed";
    return "Pending";
  };

  const getStyle = () => {
    if (status === "completed") {
      return {
        color: "#0b6b2d",
        backgroundColor: "rgba(52, 199, 89, 0.16)",
        borderColor: "rgba(52, 199, 89, 0.34)",
      };
    }

    if (status === "in_progress") {
      return {
        color: "#9a5a00",
        backgroundColor: "rgba(255, 159, 10, 0.18)",
        borderColor: "rgba(255, 159, 10, 0.38)",
      };
    }

    return {
      color: "#526071",
      backgroundColor: "rgba(142, 142, 147, 0.16)",
      borderColor: "rgba(142, 142, 147, 0.3)",
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
