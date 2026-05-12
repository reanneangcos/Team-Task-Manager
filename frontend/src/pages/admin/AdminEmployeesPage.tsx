import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Divider,
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

  if (loading) {
    return <LoadingScreen />;
  }

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
                        border: selected ? "1px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
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
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        {selectedEmployee.name}
                      </Typography>
                      <Chip size="small" label={selectedEmployee.role ?? "employee"} sx={{ mt: 0.75 }} />
                    </Box>
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
                            border: "1px solid #E2E8F0",
                            backgroundColor: "#F8FAFC",
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
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", gap: 1 }}>
                            <Typography sx={{ fontWeight: 780 }}>{task.title}</Typography>
                            <Chip size="small" label={task.status.replace("_", " ")} />
                          </Stack>
                          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
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
    </Stack>
  );
}
