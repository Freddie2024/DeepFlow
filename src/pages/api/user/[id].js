import { getUserWithTasks } from "@/src/lib/db/services/userService";
import dbConnect from "@/src/lib/db/mongoose";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // const userId = session.user.userId;

  const { id } = req.query;

  if (req.method === "GET") {
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing 'id' in query parameters" });
    }

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
