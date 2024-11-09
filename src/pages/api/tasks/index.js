import dbConnect from "@/src/lib/db/connect";
import Task from "@/src/lib/db/models/Task";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const task = await Task.find();
    return response.status(200).json(task);
  }

  if (request.method === "POST") {
    try {
      const taskData = request.body;
      await Task.create(taskData);
      response.status(201).json({ status: "Task created" });
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: "Failed to add task" });
    }
  }
}
