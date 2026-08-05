// src/routes/activityRoutes.ts
import { Router } from "express";
import { getActivityByTask, getActivityByProject } from "../controllers/activityController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);
router.get("/task/:taskId", getActivityByTask);
router.get("/project/:projectId", getActivityByProject);

export default router;