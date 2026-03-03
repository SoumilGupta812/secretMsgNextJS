import { z } from "zod";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbconnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      console.log("validation error", result);
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        { status: 400 },
      );
    }
    console.log("result data", result.data);
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 },
      );
    }
    return Response.json({ success: true, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username uniqueness", error);
    return Response.json(
      { success: false, message: "Error checking username uniqueness" },
      { status: 500 },
    );
  }
}
