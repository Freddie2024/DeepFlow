import dbConnect from "@/src/lib/db/mongoose";
import Task from "@/src/lib/db/models/Task";
import mongoose from "mongoose";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.userId;
  const { id } = req.query;

  console.log("Request ID:", id);

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (req.method === "GET") {
    try {
      const task = await Task.findOne({ _id: id, user: userId });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve task" });
    }
  } else if (req.method === "PATCH") {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, user: userId },
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
      res.status(400).json({ error: "Failed to update task" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedTask = await Task.ffindOneAndDelete({
        _id: id,
        user: userId,
      });
      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
