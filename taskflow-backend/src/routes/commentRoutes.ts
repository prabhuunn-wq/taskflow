// src/routes/commentRoutes.ts
import { Router } from "express";
import {
  addComment,
  getCommentsByTask,
  deleteComment,
} from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.post("/task/:taskId", addComment);
router.get("/task/:taskId", getCommentsByTask);
router.delete("/:id", deleteComment);

export default router;