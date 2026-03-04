import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import connectDB from "@/lib/dbconnect";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { email, username, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 },
      );
    }
    const existingUserVerifiedByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email is already registered" },
          { status: 400 },
        );
      } else {
        existingUserVerifiedByEmail.password = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.username = username;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 150 * 60 * 1000,
        );
        await existingUserVerifiedByEmail.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 15 * 60 * 1000),
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message:
          "User registered successfully. Please check your email for verification code.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 },
    );
  }
}
