import dbConnect from "@/src/lib/db/connect";
import Task from "@/src/lib/db/models/Task";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const tasks = await Task.find();
      return response.status(200).json(tasks);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: "Failed to retrieve tasks" });
    }
  }

  if (request.method === "POST") {
    try {
      const taskData = request.body;
      const newTask = await Task.create(taskData);
      response.status(201).json(newTask);
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: "Failed to add task" });
    }
  }
}
