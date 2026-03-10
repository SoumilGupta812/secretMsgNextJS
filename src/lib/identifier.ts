import { headers } from "next/headers";

export async function getIdentifier() {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for") ??
    headersList.get("x-real-ip") ??
    "anonymous";
  return ip;
}
