import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!session || !sessionUser) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
  const user: User = sessionUser as User;
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found or no messages" },
        { status: 404 },
      );
    }
    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    return Response.json(
      { success: false, message: "Failed to retrieve messages" },
      { status: 500 },
    );
  }
}
