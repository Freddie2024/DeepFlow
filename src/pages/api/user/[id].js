import { getUserWithTasks } from "@/src/lib/db/services/userService";
import dbConnect from "@/src/lib/db/mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await getUserWithTasks(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user with tasks:", error);
      return res
        .status(500)
        .json({ message: "Error fetching user with tasks" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
