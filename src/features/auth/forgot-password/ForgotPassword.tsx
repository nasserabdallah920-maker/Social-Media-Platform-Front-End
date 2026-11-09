"use client";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForgot } from "./useForgot";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const { forgotMutation } = useForgot();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    forgotMutation.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-medium tracking-tight text-gray-900">
            Forgot password?
          </h2>
          <p className="text-xs text-gray-400">
            Enter your email and we&apos;ll send you instructions. (Limit: 3 attempts / 15m)
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* رسالة الخطأ */}
          {forgotMutation.isError && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 transition-all duration-200">
              {forgotMutation.error instanceof Error
                ? forgotMutation.error.message
                : "Something went wrong. Please try again."}
            </div>
          )}

          {/* رسالة النجاح */}
          {forgotMutation.isSuccess && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-xs text-green-700 transition-all duration-200">
              Reset link sent successfully! Please check your inbox.
            </div>
          )}

          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full rounded-xl flex justify-center items-center bg-gray-900 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {forgotMutation.isPending ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : (
              "Send Reset Link"
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