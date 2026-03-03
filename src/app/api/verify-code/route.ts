import UserModel from "@/model/User";
import dbConnect from "@/lib/dbconnect";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const result = verifySchema.safeParse({ code });
    if (!result.success) {
      const verifyCodeErrors = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            verifyCodeErrors?.length > 0
              ? verifyCodeErrors.join(", ")
              : "Invalid verification code",
        },
        { status: 400 },
      );
    }
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    const isCodeValid = user.verifyCode === code;
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      user.verifyCode = "";
      user.verifyCodeExpiry = new Date(0);
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please sign up again to receive a new code",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying code", error);
    return Response.json(
      { success: false, message: "Error verifying code" },
      { status: 500 },
    );
  }
}
