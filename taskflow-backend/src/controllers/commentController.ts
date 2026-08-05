// src/controllers/commentController.ts

import { Response } from "express";
import Comment from "../models/Comment";
import ActivityLog from "../models/ActivityLog";
import Notification from "../models/Notification";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";

// Add Comment
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const taskId = req.params.taskId as string;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Comment message is required",
      });
    }

    const newComment = await Comment.create({
      task: taskId,
      author: req.userId,
      message: message.trim(),
    });

    // Activity Log
    await ActivityLog.create({
      task: taskId,
      user: req.userId,
      action: "comment_added",
    });

    // Notify assignee + reporter (excluding the commenter themselves)
    
    const task = await Task.findById(taskId);
    if (task) {
      const notifyUsers = new Set<string>();
      if (task.assignee) notifyUsers.add(task.assignee.toString());
      notifyUsers.add(task.reporter.toString());
      notifyUsers.delete(req.userId);

      for (const userId of notifyUsers) {
        await Notification.create({
          user: userId,
          message: `New comment on "${task.title}"`,
          task: task._id,
        });
      }
    }

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "name email avatar"
    );

    if (!populatedComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    return res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Add Comment Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Comments By Task
export const getCommentsByTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taskId = req.params.taskId as string;

    const comments = await Comment.find({
      task: taskId,
    })
      .populate("author", "name email avatar")
      .sort({ createdAt: 1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Get Comments Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// Delete Comment
export const deleteComment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    await ActivityLog.create({
      task: comment.task,
      user: req.userId,
      action: "comment_deleted",
    });

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};