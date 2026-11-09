"use client";
import { LoaderIcon } from "lucide-react";
import { useSignup } from "./useSignup";
import Link from "next/link";
import axios from "axios";

export default function SignupForm() {
  const {
    setFirstName,
    setLastName,
    setUserName,
    setEmail,
    setPassword,
    error,
    isPending,
    handleSignup,
  } = useSignup();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-medium tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="text-xs text-gray-400">Enter your details to sign up</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                  placeholder="John"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="johndoe"
              />
            </div>

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
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Password
              </label>
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
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-800 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
