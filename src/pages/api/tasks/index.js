import dbConnect from "@/src/lib/db/mongoose";
import Task from "@/src/lib/db/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.userId;

  if (req.method === "GET") {
    try {
      const tasks = await Task.find({ userId });
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, priority, dueDate } = req.body;

      if (!title || !priority) {
        return res
          .status(400)
          .json({ error: "Title and priority are required" });
      }

      if (dueDate && isNaN(new Date(dueDate).getTime())) {
        throw new Error("Invalid dueDate format");
      }

      const taskData = {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      };

      const newTask = await Task.create(taskData);

      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error adding task:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to add task" });
    }
  }
  console.warn(`Unsupported method ${req.method} at /api/tasks`);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
