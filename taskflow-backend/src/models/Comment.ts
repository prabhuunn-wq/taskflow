// src/models/Comment.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  task: Types.ObjectId;
  author: Types.ObjectId;
  message: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);