"use client";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useState, Suspense } from "react";
import { useAxios } from "@/lib/axios/axios";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError({ message: "Passwords do not match." });
      return;
    }

    setIsPending(true);
    setError(null);
    setMessage(null);

    try {
      const res = await useAxios.post(`/auth/reset/password?token=${token}`, {
        new_password: password,
        confirm_password: confirmPassword,
      });

      setMessage(res.data?.message || "Password has been reset successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-medium tracking-tight text-gray-900">
            Set new password
          </h2>
          <p className="text-xs text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 transition-all duration-200">
              {axios.isAxiosError(error)
                ? error.response?.data?.message
                : error.message || "An error occurred, please try again."}
            </div>
          )}

          {message && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-xs text-green-700 transition-all duration-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl flex justify-center items-center bg-gray-900 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-800 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function NewPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
          <LoaderIcon className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
