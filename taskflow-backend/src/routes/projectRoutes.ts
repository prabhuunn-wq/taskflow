// src/routes/projectRoutes.ts
import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from "../controllers/projectController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/members", addMember);
router.delete("/:id/members/:memberId", removeMember);

export default router;