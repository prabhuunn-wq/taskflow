// src/controllers/activityController.ts
import { Response } from "express";
import ActivityLog from "../models/ActivityLog";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";

export const getActivityByTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const activities = await ActivityLog.find({ task: taskId })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getActivityByProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId }).select("_id");
    const taskIds = tasks.map((t) => t._id);

    const activities = await ActivityLog.find({ task: { $in: taskIds } })
      .populate("user", "name email avatar")
      .populate("task", "title dueDate status priority")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};