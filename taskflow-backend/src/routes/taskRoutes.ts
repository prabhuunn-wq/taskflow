// src/routes/taskRoutes.ts
import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.post("/", createTask);
router.get("/project/:projectId", getTasksByProject);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;