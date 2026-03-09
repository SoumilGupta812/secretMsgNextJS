"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { MessageSchema } from "@/schemas/messageSchema";
export default function Page() {
  const [message, setMessage] = useState([
    "I saw what you did. Impressive.",
    "Your favorite snack is also mine. Coincidence?",
    "The pigeons have a message for you.",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { username } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });
  async function fetchSuggestion() {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/suggest-messages`);
      setMessage(response.data.suggestions);
    } catch (error) {
      toast.error("Failed to fetch suggestions. Please try again later.", {
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof MessageSchema>) {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: data.content,
        username,
      });
      toast.success(response.data.message, {
        position: "top-center",
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "1px solid #059669",
        },
        duration: 3000,
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast.error("Error!", {
          description: axiosError.response.data.message,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "#ffffff",
            border: "1px solid #dc2626",
          },
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      <div className="relative bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-500/30 hover:border-indigo-500/60 transition-colors">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome to the Shadows
          </h1>

          <p className="text-xs text-indigo-300/70 tracking-widest uppercase">
            Your secret messages await
          </p>
        </div>
        <form
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-content"
                    className="text-sm font-semibold text-indigo-300"
                  >
                    Secret Message
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-content"
                    aria-invalid={fieldState.invalid}
                    placeholder="Secret Message"
                    autoComplete="off"
                    className="bg-gray-800/50 border border-indigo-500/30 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Field
            orientation="horizontal"
            className="flex items-center justify-center gap-8"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send Secret"
              )}
            </Button>
          </Field>
        </form>
        <div className="text-center mt-3 text-sm">
          <Button
            variant="link"
            onClick={fetchSuggestion}
            disabled={isLoading}
            className="text-indigo-400 hover:text-indigo-500"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Secret Suggestions
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          {message.map((msg, index) => (
            <Input
              key={index}
              className="bg-gray-800/50 border overflow-x-auto border-indigo-500/30  text-white p-3 rounded-md w-full cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50 transition-colors"
              value={msg}
              readOnly
              onClick={(e) => form.setValue("content", e.target.value)}
            />
          ))}
        </div>
        <div className="text-center mt-3 text-sm text-gray-600">
          Want to have your own secret messages?{" "}
          <Link href="/sign-up" className="text-blue-500 underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
