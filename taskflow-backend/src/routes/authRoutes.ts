// src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import { deleteAccount } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.delete("/me", protect, deleteAccount);

export default router;