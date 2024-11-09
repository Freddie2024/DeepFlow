import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["long", "medium", "short"],
    default: "long",
    required: true,
  },
  dueDate: {
    type: String,
    enum: ["today", "tomorrow", "someday"],
    default: "today",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: String,
    required: true,
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;