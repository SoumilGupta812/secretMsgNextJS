import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message must be at most 1000 characters long"),
});
