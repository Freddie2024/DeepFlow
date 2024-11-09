import dbConnect from "@/src/lib/db/connect";
import Task from "@/src/lib/db/models/Task";
import mongoose from "mongoose";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid ID format" });
  }

  await dbConnect();

  if (request.method === "GET") {
    const task = await Task.findById(id);

    if (!task) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(task);
  }
}
