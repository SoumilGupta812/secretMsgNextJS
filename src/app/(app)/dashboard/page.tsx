"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
import { Loader2, RefreshCcw, X } from "lucide-react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    //Add API call to delete message from database
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
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Error!", {
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          position: "top-center",
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
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error!", {
        description:
          axiosError.response?.data.message ||
          "Failed to update accept messages status",
        position: "top-center",
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
      });
      return;
    }
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard!", {
      position: "top-center",
    });
  };
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {username}!</p>
      <div>
        <h2>Copy your secret profile URL</h2>
        <div>
          <input type="text" value={profileUrl} disabled />
          <Button onClick={copyToClipboard}>Copy URL</Button>
        </div>
      </div>
      <div>
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>
      <Separator></Separator>
      <Button onClick={() => fetchMessages(true)} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
      </Button>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((message) => (
          <Card key={message._id.toString()} className="card-bordered">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {message.content.substring(0, 20)}...
                </CardTitle>
                <CardDescription className="text-xs">
                  {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
                </CardDescription>
              </div>

              {/* Shadcn Alert Dialog for Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this message and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleDeleteMessage(message._id.toString())
                      }
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">{message.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
