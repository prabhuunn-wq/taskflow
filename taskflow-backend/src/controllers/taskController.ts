// src/controllers/taskController.ts
import { Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";
import ActivityLog from "../models/ActivityLog";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import Notification from "../models/Notification";

// Create task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { project, title, description, priority, assignee, dueDate } =
      req.body;

    if (!project || !title) {
      return res
        .status(400)
        .json({ message: "Project and title are required" });
    }

    // Only the project owner (team leader) can assign a task to someone at creation time
    if (assignee) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (projectDoc.owner.toString() !== req.userId) {
        return res
          .status(403)
          .json({ message: "Only the project owner can assign tasks" });
      }
    }

    const task = await Task.create({
      project,
      title,
      description,
      priority,
      assignee,
      dueDate,
      reporter: req.userId,
    });

    // Log task creation in the activity log
    await ActivityLog.create({
      task: task._id,
      user: req.userId,
      action: "created",
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all tasks for a project
// - The project owner (team leader) sees every task in the project.
// - Everyone else only sees tasks that are assigned to them.
export const getTasksByProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.userId;

    const filter: Record<string, unknown> = { project: projectId };
    if (!isOwner) {
      filter.assignee = req.userId;
    }

    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email")
      .sort({ order: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single task — only the project owner (team leader) or the task's own
// assignee may view it.
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.userId;
    const isAssignee = (task.assignee as any)?._id?.toString() === req.userId;

    if (!isOwner && !isAssignee) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update task (status change, assignment, priority, due date — with activity logging)
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, status, priority, assignee, dueDate, order, labels } =
      req.body;

    // Fields that only the project owner (team leader) is allowed to change:
    // assignee, dueDate, labels
    const wantsAssigneeChange = assignee && assignee !== task.assignee?.toString();
    const wantsDueDateChange = dueDate !== undefined;
    const wantsLabelsChange = labels !== undefined;

    if (wantsAssigneeChange || wantsDueDateChange || wantsLabelsChange) {
      const project = await Project.findById(task.project);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const isOwner = project.owner.toString() === req.userId;

      if (!isOwner) {
        return res.status(403).json({
          message:
            "Only the project owner can change assignee, due date, or labels",
        });
      }

      if (wantsAssigneeChange) {
        const oldAssigneeUser = task.assignee
          ? await User.findById(task.assignee)
          : null;
        const newAssigneeUser = await User.findById(assignee);

        await ActivityLog.create({
          task: task._id,
          user: req.userId,
          action: "assigned",
          oldValue: oldAssigneeUser?.name || "Unassigned",
          newValue: newAssigneeUser?.name || "Unknown",
        });
        task.assignee = assignee;

        // Notify the newly assigned user (unless they assigned it to themselves)
        if (assignee !== req.userId) {
          await Notification.create({
            user: assignee,
            message: `You were assigned to "${task.title}"`,
            task: task._id,
          });
        }
      }

      if (wantsDueDateChange) {
        task.dueDate = dueDate;
      }

      if (wantsLabelsChange) {
        task.labels = labels;
      }
    }

    // Track status change
    if (status && status !== task.status) {
      await ActivityLog.create({
        task: task._id,
        user: req.userId,
        action: "status_changed",
        oldValue: task.status,
        newValue: status,
      });
      task.status = status;
    }

    // Track priority change
    if (priority && priority !== task.priority) {
      await ActivityLog.create({
        task: task._id,
        user: req.userId,
        action: "priority_changed",
        oldValue: task.priority,
        newValue: priority,
      });
      task.priority = priority;
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (order !== undefined) task.order = order;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete task — only the project owner (team leader) may delete
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only the project owner can delete tasks" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};