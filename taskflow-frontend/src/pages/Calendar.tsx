// src/pages/Calendar.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getProjects } from "../api/projectApi";
import { getActivityByProject, type ProjectActivity } from "../api/activityApi";

interface CalendarActivity extends ProjectActivity {
  projectId: string;
  projectName: string;
}

const ACTION_META: Record<string, { label: string; color: string }> = {
  created: { label: "Created", color: "#22C55E" },
  status_changed: { label: "Status changed", color: "#3B82F6" },
  assigned: { label: "Assigned", color: "#F59E0B" },
  priority_changed: { label: "Priority changed", color: "#EF4444" },
  due_date_changed: { label: "Due date changed", color: "#8B5CF6" },
  comment_added: { label: "Comment added", color: "#06B6D4" },
  comment_deleted: { label: "Comment removed", color: "#9CA3AF" },
};
const DEFAULT_META = { label: "Updated", color: "#6B7280" };
const metaFor = (action: string) => ACTION_META[action] || DEFAULT_META;

const DUE_COLOR = "#EC4899";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Converts Date to local "YYYY-MM-DD"
const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

// Safely parses "YYYY-MM-DD" or ISO strings into a local Date without UTC offset shifts
const parseToLocalDate = (dateStr: string | Date): Date => {
  if (dateStr instanceof Date) return dateStr;
  if (!dateStr) return new Date();

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateStr);
};

const describeActivity = (log: CalendarActivity): string => {
  const name = log.user?.name || "Someone";
  const title = log.task?.title ? `"${log.task.title}"` : "a task";

  switch (log.action) {
    case "created":
      return `${name} created ${title}`;
    case "status_changed":
      return `${name} changed status from ${log.oldValue ?? "N/A"} to ${log.newValue ?? "N/A"}`;
    case "assigned":
      return `${name} reassigned from ${log.oldValue ?? "unassigned"} to ${log.newValue ?? "unassigned"}`;
    case "priority_changed":
      return `${name} changed priority from ${log.oldValue ?? "N/A"} to ${log.newValue ?? "N/A"}`;
    case "due_date_changed":
      return `${name} changed the due date on ${title}`;
    case "comment_added":
      return `${name} added a comment on ${title}`;
    case "comment_deleted":
      return `${name} removed a comment on ${title}`;
    default:
      return `${name} updated ${title}`;
  }
};

const Calendar = () => {
  const [activity, setActivity] = useState<CalendarActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(dateKey(new Date()));

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const projects = await getProjects();

        const results = await Promise.allSettled(
          projects.map(async (p) => {
            const logs = await getActivityByProject(p._id);
            return logs.map((log) => ({
              ...log,
              projectId: p._id,
              projectName: p.name,
            }));
          })
        );

        const mergedActivity = results
          .filter(
            (res): res is PromiseFulfilledResult<CalendarActivity[]> =>
              res.status === "fulfilled"
          )
          .flatMap((res) => res.value);

        if (isMounted) {
          setActivity(mergedActivity);
        }
      } catch (err) {
        console.error("Failed to load activity", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const activityByDate = useMemo(() => {
    const map = new Map<string, CalendarActivity[]>();
    activity.forEach((log) => {
      const key = dateKey(parseToLocalDate(log.createdAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(log);
    });
    return map;
  }, [activity]);

  const dueByDate = useMemo(() => {
    const map = new Map<string, { id: string; title: string; project: string }[]>();
    const seen = new Set<string>();

    activity.forEach((log) => {
      if (!log.task?.dueDate) return;
      const id = log.task._id;
      if (seen.has(id)) return;
      seen.add(id);

      const key = dateKey(parseToLocalDate(log.task.dueDate));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ id, title: log.task.title, project: log.projectName });
    });
    return map;
  }, [activity]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToMonth = (delta: number) =>
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  const goToday = () => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(dateKey(now));
  };

  const selectedLogs = activityByDate.get(selectedDate) || [];
  const selectedDue = dueByDate.get(selectedDate) || [];
  const todayKey = dateKey(new Date());

  const formattedSelectedDateHeader = parseToLocalDate(selectedDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#F7F8FA", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
       <TopBar />

        <Box sx={{ p: { xs: 1.5, sm: 2, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: 22, sm: 28, md: 34 } }}
          >
            Calendar
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, fontSize: { xs: 12.5, sm: 14 } }}
          >
            Who did what, and when — task activity and deadlines across all your
            projects
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 2, sm: 3 }}>
              {/* ---- Calendar Grid ---- */}
              <Paper
                elevation={0}
                sx={{
                  flex: 2,
                  p: { xs: 1.5, sm: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #ECECEC",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                  minWidth: 0,
                }}
              >
                {/* Month nav */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: { xs: 1.5, sm: 2.5 },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, sm: 18 } }}>
                    {monthLabel}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    <Tooltip title="Jump to today">
                      <IconButton onClick={goToday} size="small">
                        <TodayOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton onClick={() => goToMonth(-1)} size="small">
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => goToMonth(1)} size="small">
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Weekday header */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    mb: 1,
                  }}
                >
                  {WEEKDAYS.map((d) => (
                    <Typography
                      key={d}
                      align="center"
                      sx={{
                        fontSize: { xs: 10, sm: 12 },
                        fontWeight: 600,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                        {d}
                      </Box>
                      <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                        {d[0]}
                      </Box>
                    </Typography>
                  ))}
                </Box>

                {/* Day cells */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: { xs: 0.5, sm: 1 },
                  }}
                >
                  {cells.map((d) => {
                    const key = dateKey(d);
                    const inMonth = d.getMonth() === cursor.getMonth();
                    const logs = activityByDate.get(key) || [];
                    const due = dueByDate.get(key) || [];
                    const isSelected = key === selectedDate;
                    const isToday = key === todayKey;

                    const actionTypes = Array.from(
                      new Set(logs.map((l) => l.action))
                    ).slice(0, 4);

                    return (
                      <Box
                        key={key}
                        onClick={() => setSelectedDate(key)}
                        sx={{
                          minHeight: { xs: 52, sm: 64, md: 78 },
                          p: { xs: 0.5, sm: 1 },
                          borderRadius: { xs: 1.5, sm: 2 },
                          cursor: "pointer",
                          border: isSelected
                            ? "2px solid #1976d2"
                            : "1px solid #ECECEC",
                          bgcolor: inMonth ? "#fff" : "#FAFBFC",
                          opacity: inMonth ? 1 : 0.5,
                          transition: "all .15s ease",
                          overflow: "hidden",
                          "&:hover": { borderColor: "#1976d2" },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: 11, sm: 13 },
                            fontWeight: isToday ? 700 : 500,
                            color: isToday ? "#1976d2" : "#374151",
                            mb: 0.5,
                          }}
                        >
                          {d.getDate()}
                        </Typography>

                        <Stack direction="row" spacing={0.4} sx={{ flexWrap: "wrap" }}>
                          {actionTypes.slice(0, 2).map((a) => (
                            <Box
                              key={a}
                              sx={{
                                width: { xs: 4, sm: 6 },
                                height: { xs: 4, sm: 6 },
                                borderRadius: "50%",
                                bgcolor: metaFor(a).color,
                                display: { xs: "block", sm: "block" },
                              }}
                            />
                          ))}
                          {/* Show remaining dots only on sm+ to avoid overflow on mobile */}
                          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.4 }}>
                            {actionTypes.slice(2).map((a) => (
                              <Box
                                key={a}
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: metaFor(a).color,
                                }}
                              />
                            ))}
                          </Box>
                        </Stack>

                        {due.length > 0 && (
                          <Chip
                            icon={<EventOutlinedIcon sx={{ fontSize: 10 }} />}
                            label={
                              due.length === 1
                                ? "Due"
                                : `${due.length} due`
                            }
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: { xs: 14, sm: 18 },
                              fontSize: { xs: 8, sm: 10 },
                              maxWidth: "100%",
                              "& .MuiChip-label": {
                                px: { xs: 0.4, sm: 0.8 },
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                              bgcolor: `${DUE_COLOR}1A`,
                              color: DUE_COLOR,
                              "& .MuiChip-icon": {
                                color: DUE_COLOR,
                                ml: { xs: 0.2, sm: 0.5 },
                                fontSize: { xs: 9, sm: 12 },
                              },
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Legend */}
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 2 }}
                  sx={{ mt: 2.5, rowGap: 1, flexWrap: "wrap" }}
                >
                  {Object.keys(ACTION_META).map((a) => (
                    <Stack
                      key={a}
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: metaFor(a).color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: 10.5, sm: 12.5 }, color: "#6B7280" }}>
                        {metaFor(a).label}
                      </Typography>
                    </Stack>
                  ))}
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: DUE_COLOR,
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontSize: { xs: 10.5, sm: 12.5 }, color: "#6B7280" }}>
                      Due date
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {/* ---- Selected Day Detail Panel ---- */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid #ECECEC",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                  maxHeight: { xs: 420, sm: 500, lg: 640 },
                  overflowY: "auto",
                  minWidth: 0,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 14.5, sm: 16 }, mb: 0.3 }}>
                  {formattedSelectedDateHeader}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: 11.5, sm: 12 } }}
                >
                  {selectedLogs.length} activity update
                  {selectedLogs.length !== 1 ? "s" : ""}
                  {selectedDue.length > 0 &&
                    ` · ${selectedDue.length} task${
                      selectedDue.length !== 1 ? "s" : ""
                    } due`}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {selectedDue.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {selectedDue.map((t, i) => (
                      <Stack
                        key={t.id || `${t.project}-${t.title}-${i}`}
                        direction="row"
                        spacing={1}
                        sx={{
                          p: 1,
                          mb: 0.5,
                          borderRadius: 1.5,
                          bgcolor: `${DUE_COLOR}0D`,
                          alignItems: "center",
                        }}
                      >
                        <EventOutlinedIcon sx={{ fontSize: 16, color: DUE_COLOR, flexShrink: 0 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t.title}
                          </Typography>
                          <Typography sx={{ fontSize: 11.5, color: "#9CA3AF" }}>
                            Due today · {t.project}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Box>
                )}

                {selectedLogs.length === 0 ? (
                  <Typography sx={{ fontSize: 13.5, color: "#9CA3AF", mt: 1 }}>
                    No task activity on this date.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {selectedLogs.map((log) => (
                      <Box key={log._id}>
                        <Stack
                          direction="row"
                          spacing={1.2}
                          sx={{ alignItems: "flex-start" }}
                        >
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: 12,
                              bgcolor: metaFor(log.action).color,
                              flexShrink: 0,
                            }}
                          >
                            {log.user?.name?.charAt(0).toUpperCase() || "U"}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: 13, color: "#374151" }}>
                              {describeActivity(log)}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center", mt: 0.3, flexWrap: "wrap", rowGap: 0.3 }}
                            >
                              <Chip
                                label={metaFor(log.action).label}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: 10,
                                  bgcolor: `${metaFor(log.action).color}1A`,
                                  color: metaFor(log.action).color,
                                }}
                              />
                              <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>
                                {log.projectName}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>
                                {new Date(log.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;