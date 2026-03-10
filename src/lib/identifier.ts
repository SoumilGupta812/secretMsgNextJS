import { headers } from "next/headers";

export async function getIdentifier() {
  const headersList = await headers();
  console.log("Headers:", Object.fromEntries(headersList.entries())); // Log all headers for debugging
  const ip =
    headersList.get("x-forwarded-for") ??
    headersList.get("x-real-ip") ??
    "anonymous";

  return ip;
}
