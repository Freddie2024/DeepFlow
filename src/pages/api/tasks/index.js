import dbConnect from "@/src/lib/db/mongoose";
import Task from "@/src/lib/db/models/Task";
// import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  // const session = await getSession({ req });
  const session = await getServerSession(req, res, authOptions);
  // console.log("session;:::::", session);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.userId;

  if (req.method === "GET") {
    try {
      const tasks = await Task.find({ user: userId });
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  }

  if (req.method === "POST") {
    // console.log("req.body, userID", req.body, userId);
    try {
      const taskData = { ...req.body };
      console.log("taskData", taskData);
      const newTask = await Task.create(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(400).json({ error: "Failed to add task" });
    }
  }
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
