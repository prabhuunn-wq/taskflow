// src/components/team/useTeamData.ts
import { useEffect, useState, useCallback } from "react";
import { getProjects, getProjectById, type Project } from "../../api/projectApi";
import { getTasksByProject } from "../../api/taskApi";
import type { TeamMember } from "./TeamMemberRow";

export interface ProjectTeam {
  project: Project;
  owner: { _id: string; name: string; email: string };
  members: TeamMember[];
}

export const useTeamData = () => {
  const [teams, setTeams] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      const projects = await getProjects();

      const results: ProjectTeam[] = await Promise.all(
        projects.map(async (p) => {
          const full = await getProjectById(p._id);
          const tasks = await getTasksByProject(p._id);

          const members: TeamMember[] = (full.members as any[]).map((m) => ({
            _id: m._id,
            name: m.name,
            email: m.email,
            avatar: m.avatar,
            tasks: tasks.filter((t) => t.assignee?._id === m._id),
          }));

          return {
            project: full,
            owner: full.owner as any,
            members,
          };
        })
      );

      setTeams(results);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return { teams, loading, reload: loadTeams };
};