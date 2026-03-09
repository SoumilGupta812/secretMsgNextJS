import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge"; // Optional: for faster performance

export async function GET(req: Request) {
  try {
    // We use gemini-1.5-flash because it's fast and has a huge free tier
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system:
        "You are a creative assistant for a secret message app. Generate 3 short, intriguing, or funny anonymous message suggestions. Keep them under 15 words. Separate them by '||'.",
      prompt: "Give me 3 suggestions for secret messages to send to a friend.",
    });

    // Split the text by '||' and clean up
    const suggestions = text.split("||").map((s) => s.trim());

    return Response.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return Response.json({ error: "AI Service is busy" }, { status: 500 });
  }
}
