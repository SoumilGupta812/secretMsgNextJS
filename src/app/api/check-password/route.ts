import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  // SHA1 hash
  const sha1 = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex")
    .toUpperCase();

  const prefix = sha1.substring(0, 5);
  const suffix = sha1.substring(5);

  const response = await axios.get(
    `https://api.pwnedpasswords.com/range/${prefix}`,
  );

  const text = await response.data;

  const lines = text.split("\n");

  for (const line of lines) {
    const [hashSuffix] = line.split(":");

    if (hashSuffix === suffix) {
      return NextResponse.json(
        { success: false, message: "Password too weak" },
        { status: 400 },
      );
    }
  }

  return NextResponse.json(
    { success: true, message: "Strong password" },
    { status: 200 },
  );
}
