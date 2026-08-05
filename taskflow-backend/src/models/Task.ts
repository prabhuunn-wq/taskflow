// src/models/Task.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  project: Types.ObjectId;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: Types.ObjectId;
  reporter: Types.ObjectId;
  dueDate?: Date;
  order: number;
  labels: string[];
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["todo", "inprogress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date },
    order: { type: Number, default: 0 },
    labels: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);