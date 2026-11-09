"use client";
import { LoaderIcon } from "lucide-react";
import { useLogin } from "./useLogin";
import Link from "next/link";
import axios from "axios";

export default function LoginForm() {
  const { setEmail, setPassword, error, isPending, handleLogin } = useLogin();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-medium tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="text-xs text-gray-400">
            Enter your details to access your account
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">
                  Password
                </label>
                <Link
                  href={'/login/forgot-password'}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl flex justify-center items-center bg-gray-900 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don&#39;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-gray-800 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
