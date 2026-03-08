"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { register, watch, setValue } = useForm<
    z.infer<typeof acceptMessageSchema>
  >({
    resolver: zodResolver(acceptMessageSchema),
  });
  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prev) =>
      prev.filter((msg) => msg._id.toString() !== messageId),
    );
  };
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/sign-in");
    },
  });
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", !!response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error!", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch accept messages status",
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);
  const fetchMessages = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        if (response.data.success) {
          setMessages(response.data.messages || []);
        }
        if (refresh) {
          toast.success("Messages refreshed!", {
            position: "top-center",
            style: {
              background: "#10b981",
              color: "#ffffff",
              border: "1px solid #059669",
            },
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Error!", {
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "#ffffff",
            border: "1px solid #dc2626",
          },
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );
  useEffect(() => {
    if (!session || !session.user) return;
    if (status === "authenticated") {
      fetchMessages(false);
      fetchAcceptMessages();
    }
  }, [status, fetchMessages, fetchAcceptMessages, session]);
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message, {
        position: "top-center",
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "1px solid #059669",
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error!", {
        description:
          axiosError.response?.data.message ||
          "Failed to update accept messages status",
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };
  if (!session || !session.user) {
    return <></>;
  }
  const { username } = session?.user as User;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard API not supported", {
        position: "top-center",
        className:
          "bg-gray-900/80 text-gray-200 border border-indigo-500/30 backdrop-blur-xl",
      });
      return;
    }
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard!", {
      position: "top-center",
      className:
        "bg-gray-900/80 text-gray-200 border border-indigo-500/30 backdrop-blur-xl",
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      <div className="relative bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-indigo-500/30 hover:border-indigo-500/60 transition-colors">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            User Dashboard
          </h1>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-200">
              Copy your secret profile URL
            </h2>
            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Copy URL
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-start space-x-3.5">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-700 border border-gray-600"
            />
            <span className="text-sm text-gray-300">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Separator className="bg-gray-600" />
          <div className="flex justify-center">
            <Button
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <RefreshCcw className="mr-2" />
              )}
              Refresh
            </Button>
          </div>
          {messages.length === 0 ? (
            <p className="text-center text-gray-400">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id.toString()}
                  message={message}
                  onDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
