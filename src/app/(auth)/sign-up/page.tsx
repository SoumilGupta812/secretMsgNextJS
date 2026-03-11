"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAsyncValidator } from "@/hooks/useAsyncValidator";
import { usernameValidator } from "@/helpers/usernameValidator";
import { passwordValidator } from "@/helpers/passwordValidator";

export default function SignUp() {
  const {
    value: username,
    debounced,
    setMessage: setUsernameMessage,
    message: usernameMessage,
    isChecking: isCheckingUsername,
  } = useAsyncValidator(usernameValidator, 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const {
    value: password,
    setMessage: setPasswordMessage,
    message: passwordMessage,
    isChecking: isCheckingPassword,
    debounced: debouncedPassword,
  } = useAsyncValidator(passwordValidator, 500);

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success("Success!", {
        description: response.data.message,
        position: "top-center",
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "1px solid #059669",
        },
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error!", {
        description:
          axiosError.response?.data.message || "Error during sign up",
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
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
            SecretMsg
          </h1>

          <p className="text-xs text-indigo-300/70 tracking-widest uppercase">
            Enter the shadows. Share in silence.
          </p>
        </div>
        <form
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-username"
                    className="text-sm font-semibold text-indigo-300"
                  >
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                      setUsernameMessage("");
                    }}
                    id="form-rhf-demo-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="off"
                    className="bg-gray-800/50 border border-indigo-500/30 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : isCheckingUsername ? (
                    <FieldDescription className="text-xs text-yellow-400">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking
                      username...
                    </FieldDescription>
                  ) : usernameMessage ? (
                    <FieldDescription
                      className={`text-xs ${usernameMessage.includes("available") ? "text-green-400" : "text-red-400"}`}
                    >
                      {usernameMessage}
                    </FieldDescription>
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-email"
                    className="text-sm font-semibold text-indigo-300"
                  >
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="off"
                    className="bg-gray-800/50 border border-indigo-500/30 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-password"
                    className="text-sm font-semibold text-indigo-300"
                  >
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedPassword(e.target.value);
                      setPasswordMessage("");
                    }}
                    id="form-rhf-demo-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off"
                    className="bg-gray-800/50 border border-indigo-500/30 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : isCheckingPassword ? (
                    <FieldDescription className="text-xs text-yellow-400">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking
                      password...
                    </FieldDescription>
                  ) : passwordMessage ? (
                    <FieldDescription
                      className={`text-xs ${passwordMessage.includes("Strong") ? "text-green-400" : "text-red-400"}`}
                    >
                      {passwordMessage}
                    </FieldDescription>
                  ) : null}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </Field>
        </form>
        <div className="text-center mt-3 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
