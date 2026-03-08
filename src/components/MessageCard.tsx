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
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Message } from "@/model/User";
import axios from "axios";
type MessageCardProps = {
  message: Message;
  onDelete: (messageId: string) => void;
};
export default function MessageCard({ message, onDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id.toString()}`,
    );
    toast.success(response.data.message, {
      position: "top-center",
      style: {
        background: "#10b981",
        color: "#ffffff",
        border: "1px solid #059669",
      },
    });
    onDelete(message._id.toString());
  };
  return (
    <Card
      key={message._id.toString()}
      className="border border-gray-600 rounded-lg shadow-sm bg-gray-800/50 backdrop-blur-sm"
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold line-clamp-1 text-gray-200">
            {message.content}
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
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
          <AlertDialogContent className="bg-gray-800 border-gray-600">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-200">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete this
                message and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-gray-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteConfirm()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      {/* <CardContent>
        <p className="text-sm text-gray-300">{message.content}</p>
      </CardContent> */}
    </Card>
  );
}
