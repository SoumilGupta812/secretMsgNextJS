"use client";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const formId = useId();
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isVerifying, setIsVerifying] = useState(false);
  const { username } = params;
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsVerifying(true);
      const response = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });
      toast.success("Success!", {
        description: response.data.message,
        position: "top-center",
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "1px solid #059669",
        },
      });
      router.replace(`/sign-in`);
    } catch (error) {
      console.error("Error during code verification", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error!", {
        description:
          axiosError.response?.data.message || "Error during code verification",
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      });
      router.replace(`/sign-up`);
    } finally {
      setIsVerifying(false);
    }
  };

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
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-code"
                    className="text-sm font-semibold text-indigo-300"
                  >
                    Verification Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Verification Code"
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
            <Button type="submit" form={formId} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                  code ...
                </>
              ) : (
                "Verify Code"
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
