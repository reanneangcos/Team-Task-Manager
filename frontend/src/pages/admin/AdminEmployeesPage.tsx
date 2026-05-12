import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import api from "../../api/axios";
import LoadingScreen from "../../components/common/LoadingScreen";
import type { Task, User } from "../../types";
import { getMediaUrl } from "../../utils/media";

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

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchEmployees = async () => {
      try {
        const [employeesResponse, tasksResponse] = await Promise.all([
          api.get<User[]>("/users"),
          api.get<Task[]>("/tasks"),
        ]);

        if (!active) {
          return;
        }

        setEmployees(employeesResponse.data);
        setTasks(tasksResponse.data);
        setSelectedEmployeeId(employeesResponse.data[0]?.id ?? null);
      } catch {
        if (active) {
          setError("Unable to load employee information.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchEmployees();

    return () => {
      active = false;
    };
  }, []);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  const selectedTasks = useMemo(() => {
    if (!selectedEmployee) {
      return [];
    }

    return tasks.filter((task) =>
      task.users?.some((employee) => employee.id === selectedEmployee.id),
    );
  }, [selectedEmployee, tasks]);

  const completedTasks = selectedTasks.filter((task) => task.status === "completed").length;
  const activeTasks = selectedTasks.filter((task) => task.status === "in_progress").length;
  const pendingTasks = selectedTasks.filter((task) => task.status === "pending").length;

  const updateEmployeeStatus = async () => {
    if (!selectedEmployee) {
      return;
    }

    setStatusUpdating(true);
    setMessage("");
    setError("");

    try {
      const response = await api.patch<{ user: User; message: string }>(
        `/users/${selectedEmployee.id}/status`,
        { is_active: !selectedEmployee.is_active },
      );

      setEmployees((current) =>
        current.map((employee) =>
          employee.id === selectedEmployee.id ? response.data.user : employee,
        ),
      );
      setMessage(response.data.message);
    } catch {
      setError("Unable to update employee account status.");
    } finally {
      setStatusUpdating(false);
      setConfirmDisableOpen(false);
    }
  };

  const handleStatusToggle = () => {
    if (!selectedEmployee) {
      return;
    }

    if (selectedEmployee.is_active === false) {
      void updateEmployeeStatus();
      return;
    }

    setConfirmDisableOpen(true);
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
              Employees
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Review employee profiles and assigned work.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip icon={<PeopleRoundedIcon />} label={`${employees.length} Employees`} />
            <Chip icon={<AssignmentRoundedIcon />} label={`${tasks.length} Tasks`} />
          </Stack>
        </Stack>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {message && (
        <Alert
          severity="success"
          sx={{
            border: "1px solid #22C55E",
            backgroundColor: "#F0FDF4",
            color: "#166534",
            "& .MuiAlert-icon": {
              color: "#22C55E",
            },
          }}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1}>
                {employees.map((employee) => {
                  const selected = employee.id === selectedEmployeeId;

                  return (
                    <ButtonBase
                      key={employee.id}
                      onClick={() => setSelectedEmployeeId(employee.id)}
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
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", width: "100%" }}>
                        <Avatar
                          src={getMediaUrl(employee.avatar_url)}
                          sx={{ width: 44, height: 44, fontWeight: 850 }}
                        >
                          {employee.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 850 }} noWrap>
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                            {employee.email}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>
                            Created {formatDateTime(employee.created_at)}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={employee.is_active === false ? "Inactive" : "Active"}
                          sx={{
                            ml: "auto",
                            color: employee.is_active === false ? "#991B1B" : "#166534",
                            borderColor: employee.is_active === false ? "#EF4444" : "#22C55E",
                            backgroundColor: employee.is_active === false ? "#FEF2F2" : "#F0FDF4",
                          }}
                          variant="outlined"
                        />
                      </Stack>
                    </ButtonBase>
                  );
                })}
              </Stack>

              {employees.length === 0 && (
                <Typography sx={{ color: "text.secondary" }}>
                  No employees found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              {selectedEmployee ? (
                <Stack spacing={2.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
                    <Avatar
                      src={getMediaUrl(selectedEmployee.avatar_url)}
                      sx={{ width: 84, height: 84, fontSize: 30, fontWeight: 900 }}
                    >
                      {selectedEmployee.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        {selectedEmployee.name}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.75, flexWrap: "wrap" }}>
                        <Chip size="small" label={selectedEmployee.role ?? "employee"} />
                        <Chip
                          size="small"
                          label={selectedEmployee.is_active === false ? "Inactive" : "Active"}
                          variant="outlined"
                          sx={{
                            color: selectedEmployee.is_active === false ? "#991B1B" : "#166534",
                            borderColor: selectedEmployee.is_active === false ? "#EF4444" : "#22C55E",
                            backgroundColor:
                              selectedEmployee.is_active === false ? "#FEF2F2" : "#F0FDF4",
                          }}
                        />
                      </Stack>
                    </Box>
                    <Button
                      variant={selectedEmployee.is_active === false ? "contained" : "outlined"}
                      startIcon={<PowerSettingsNewRoundedIcon />}
                      disabled={statusUpdating}
                      onClick={handleStatusToggle}
                      sx={{
                        ml: { sm: "auto" },
                        ...(selectedEmployee.is_active === false
                          ? {
                              backgroundColor: "#22C55E",
                              color: "#FFFFFF",
                              "&:hover": {
                                backgroundColor: "#16A34A",
                              },
                            }
                          : {
                              borderColor: "#DC2626",
                              color: "#DC2626",
                              backgroundColor: "#FEF2F2",
                              "&:hover": {
                                borderColor: "#B91C1C",
                                backgroundColor: "#FEE2E2",
                                color: "#B91C1C",
                              },
                            }),
                      }}
                    >
                      {selectedEmployee.is_active === false ? "Enable Account" : "Disable Account"}
                    </Button>
                  </Stack>

                  <Divider />

                  <Grid container spacing={1.5}>
                    {[
                      [<MailRoundedIcon />, "Email", selectedEmployee.email],
                      [<BadgeRoundedIcon />, "Employee ID", `#${selectedEmployee.id}`],
                      [<CalendarMonthRoundedIcon />, "Created", formatDateTime(selectedEmployee.created_at)],
                      [<AssignmentRoundedIcon />, "Assigned", selectedTasks.length],
                      [<PendingActionsRoundedIcon />, "Pending", pendingTasks],
                      [<AssignmentRoundedIcon />, "Active", activeTasks],
                      [<CheckCircleRoundedIcon />, "Completed", completedTasks],
                    ].map(([icon, label, value]) => (
                      <Grid key={String(label)} size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "8px",
                            border: "1px solid #D2D2D7",
                            backgroundColor: "#F5F5F7",
                          }}
                        >
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                {label}
                              </Typography>
                              <Typography sx={{ fontWeight: 850 }} noWrap>
                                {value}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box>
                    <Typography sx={{ fontWeight: 850, mb: 1 }}>
                      Assigned Tasks
                    </Typography>
                    <Stack spacing={1}>
                      {selectedTasks.map((task) => (
                        <Box
                          key={task.id}
                          sx={{
                            p: 1.5,
                            borderRadius: "8px",
                            border: "1px solid #D2D2D7",
                          }}
                        >
                          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", gap: 1 }}>
                            <Typography sx={{ fontWeight: 780 }}>{task.title}</Typography>
                            <Chip size="small" label={task.status.replace("_", " ")} />
                          </Stack>
                          <Typography variant="body2" sx={{ color: "#1D1D1F", fontWeight: 500, mt: 0.5 }}>
                            {task.description}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {selectedTasks.length === 0 && (
                      <Typography sx={{ color: "text.secondary" }}>
                        This employee has no assigned tasks.
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  Select an employee to view their information.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={confirmDisableOpen}
        onClose={() => {
          if (!statusUpdating) {
            setConfirmDisableOpen(false);
          }
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              border: "1px solid #FCA5A5",
              boxShadow: "0 24px 70px rgba(127, 29, 29, 0.2)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#991B1B" }}>
          Disable employee account?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#1D1D1F" }}>
            Are you sure you want to disable {selectedEmployee?.name}'s account?
            They will no longer be able to log in, but their task history will
            remain visible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setConfirmDisableOpen(false)}
            disabled={statusUpdating}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={statusUpdating}
            onClick={() => void updateEmployeeStatus()}
            sx={{
              backgroundColor: "#DC2626",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#B91C1C",
              },
            }}
          >
            Yes, Disable Account
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
