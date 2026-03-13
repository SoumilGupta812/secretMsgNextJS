"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    // console.log("Sign in result:", result);
    if (result?.error === "RATE_LIMIT") {
      toast.error("Too Many Attempts.", {
        description: "Please Try Again Later",
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
    }
    if (result?.error) {
      toast.error("Login Failed", {
        description: result.error || "Incorrect email/username or password",
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
    }
    if (result?.ok && result?.status === 200) {
      toast.success("Success!", {
        description: "Logged in successfully",
        position: "top-center",
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "1px solid #059669",
        },
      });
      // router.refresh();
      router.replace("/dashboard");
    }

    setIsSubmitting(false);
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
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-email/username"
                    className="text-sm font-semibold text-indigo-300"
                  >
                    Email/Username
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-demo-email/username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email/Username"
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
                    id="form-rhf-demo-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Field>
        </form>
        <div className="text-center mt-3 text-sm text-gray-600">
          Do not have an account?{" "}
          <Link href="/sign-up" className="text-blue-500 underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
