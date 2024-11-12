import dbConnect from "@/src/lib/db/connect";
import Task from "@/src/lib/db/models/Task";
import mongoose from "mongoose";

export default async function handler(request, response) {
  const { id } = request.query;

  console.log("Request ID:", id);

  if (!id) {
    return response.status(400).json({ error: "ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid ID format" });
  }

  await dbConnect();

  if (request.method === "GET") {
    try {
      const task = await Task.findById(id);

      if (!task) {
        return response.status(404).json({ error: "Task not found" });
      }

      response.status(200).json(task);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Failed to retrieve task" });
    }
  } else if (request.method === "PATCH") {
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, request.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedTask) {
        return response.status(404).json({ error: "Task not found" });
      }
      response.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: "Failed to update task" });
    }
  } else if (request.method === "DELETE") {
    try {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return response.status(404).json({ error: "Task not found" });
      }
      response.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Failed to delete task" });
    }
  } else {
    response.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
