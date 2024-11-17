import dbConnect from "@/src/lib/db/mongoose";
import Task from "@/src/lib/db/models/Task";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session?.user?.userId;
  const { id: taskId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  if (taskId === undefined || taskId === "") {
    return res.status(400).json({ error: "Task ID is missing" });
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const task = await Task.findOne({
        _id: taskId,
        userId: userId,
      });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to retrieve task" });
    }
  } else if (req.method === "PATCH") {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        {
          _id: taskId,
          userId: userId,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message || "Failed to update task" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        userId: userId,
      });

      if (!deletedTask) {
        console.error("No task found with the provided ID and userId");

        return res.status(404).json({ error: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to delete task" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
