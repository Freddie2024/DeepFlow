// import dbConnect from "@/lib/dbConnect";
// import Task from "@/models/Task";

export default async function handler(req, res) {
  //   await dbConnect();
  //   if (req.method === "GET") {
  //     try {
  //       const tasks = await Task.find({});
  //       res.status(200).json(tasks);
  //     } catch (error) {
  //       res.status(500).json({ error: "Failed to fetch tasks" });
  //     }
  //   } else if (req.method === "POST") {
  //     try {
  //       const newTask = new Task(req.body);
  //       await newTask.save();
  //       res.status(201).json(newTask);
  //     } catch (error) {
  //       res.status(500).json({ error: "Failed to add task" });
  //     }
  //   } else {
  //     res.setHeader("Allow", ["GET", "POST"]);
  //     res.status(405).end(`Method ${req.method} Not Allowed`);
  //   }
}
