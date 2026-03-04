import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  // const user: User =session?.user as User;
  if (!session || !sessionUser) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
  const user: User = sessionUser as User;
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update acceptMessages status" },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "acceptMessages status updated successfully",
        updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update acceptMessages status:", error);
    return Response.json(
      { success: false, message: "Failed to update acceptMessages status" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  // const user: User =session?.user as User;
  if (!session || !sessionUser) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
  const user: User = sessionUser as User;
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to retrieve user acceptMessages status:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve user acceptMessages status",
      },
      { status: 500 },
    );
  }
}
