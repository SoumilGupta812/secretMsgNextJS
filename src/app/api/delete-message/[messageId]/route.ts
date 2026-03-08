import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ messageId: string }>;
  },
) {
  const { messageId } = await params;

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
  try {
    const updatedresult = await UserModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(user.id),
      },
      {
        $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } },
      },
    );
    if (updatedresult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 },
      );
    }
    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Failed to delete message" },
      { status: 500 },
    );
  }
}
