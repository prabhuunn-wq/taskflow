import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../api/projectApi";
import { getTasksByProject, type Task } from "../api/taskApi";

import {
  getPriorityData,
  getStatusData,
  getSummary,
  getWorkloadData,
} from "../utils/reportUtils";

const useReports = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      setLoading(true);
      setError("");

      try {
        const projects = await getProjects();

        const results = await Promise.all(
          projects.map((project) =>
            getTasksByProject(project._id)
          )
        );

        if (active) {
          setTasks(results.flat());
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError("Failed to load reports.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const statusData = useMemo(
    () => getStatusData(tasks),
    [tasks]
  );

  const priorityData = useMemo(
    () => getPriorityData(tasks),
    [tasks]
  );

  const workloadData = useMemo(
    () => getWorkloadData(tasks),
    [tasks]
  );

  const summary = useMemo(
    () => getSummary(tasks),
    [tasks]
  );

  return {
    tasks,
    loading,
    error,

    statusData,
    priorityData,
    workloadData,

    summary,
  };
};

export default useReports;