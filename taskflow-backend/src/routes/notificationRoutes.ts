// src/routes/notificationRoutes.ts
import { Router } from "express";
import { getMyNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);
router.get("/", getMyNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);

export default router;