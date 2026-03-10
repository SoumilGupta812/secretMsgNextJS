import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { text } = await generateText({
      model: google("gemini-3.1-flash-lite-preview"),
      system:
        "You are a creative assistant for a secret message app. Generate 3 short, intriguing, or funny anonymous message suggestions. Keep them under 15 words. Separate them by '||'.",
      prompt: "Give me 3 suggestions for secret messages to send to a friend.",
    });

    const suggestions = text.split("||").map((s) => s.trim());

    return Response.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return Response.json(
      { success: false, message: "Failed to generate suggestions" },
      { status: 500 },
    );
  }
}
