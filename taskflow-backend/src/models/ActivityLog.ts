// src/models/ActivityLog.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type ActivityAction =
  | "created"
  | "status_changed"
  | "assigned"
  | "priority_changed"
  | "due_date_changed"
  | "comment_added"
  | "comment_deleted";

export interface IActivityLog extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  action: ActivityAction;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: [
        "created",
        "status_changed",
        "assigned",
        "priority_changed",
        "due_date_changed",
        "comment_added",
        "comment_deleted",
      ],
      required: true,
    },
    oldValue: { type: String },
    newValue: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);