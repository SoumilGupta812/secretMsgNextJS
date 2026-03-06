"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
export default function DashboardPage() {
  const router = useRouter();
  const onSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.replace("/sign-in");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Welcome to the Dashboard!</h1>
      <button
        onClick={onSignOut}
        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
      >
        Sign Out
      </button>
    </div>
  );
}
