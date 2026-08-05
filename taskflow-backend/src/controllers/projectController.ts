// src/controllers/projectController.ts
import { Response } from "express";
import Project from "../models/Project";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";

// Create project
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all projects for logged-in user
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const projects = await Project.find({
      members: req.userId,
    }).populate("owner", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single project
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, description, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    if (status) project.status = status;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only owner can add members" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push(user._id);
    await project.save();

    const updatedProject = await Project.findById(project._id).populate(
      "members",
      "name email"
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { memberId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    if (memberId === project.owner.toString()) {
      return res.status(400).json({ message: "Cannot remove the project owner" });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== memberId
    );
    await project.save();

    const updatedProject = await Project.findById(project._id).populate(
      "members",
      "name email"
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};