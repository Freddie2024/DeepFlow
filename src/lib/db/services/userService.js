import User from "@/src/lib/db/models/User";
import dbConnect from "@/src/lib/db/mongoose";

export async function getUserWithTasks(userId) {
  await dbConnect();

  try {
    const user = await User.findById(userId).populate("tasks").exec();
    return user;
  } catch (error) {
    console.error("Error fetching user with tasks:", error);
    throw error;
  }
}
