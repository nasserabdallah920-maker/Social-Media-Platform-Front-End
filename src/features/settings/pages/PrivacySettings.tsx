"use client";

import { LoaderIcon, Lock, UserX, User } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { usePrivacySettings } from "../hooks/usePrivacySettings";
import { useBlockedUsers } from "../hooks/useBlockedUsers";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Could not update privacy. Please try again."
    );
  }
  if (error instanceof Error) return error.message;
  return "Could not update privacy. Please try again.";
}

export default function PrivacySettings() {
  const {
    isPrivate,
    isLoadingUser,
    userError,
    togglePrivacy,
    isToggling,
    toggleError,
  } = usePrivacySettings();

  const {
    blockedUsers,
    isLoading: isLoadingBlocked,
    isError: isBlockedError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    unblockUser,
    unblockingId,
  } = useBlockedUsers();

  if (isLoadingUser) {
    return (
      <div className="flex justify-center py-16">
        <LoaderIcon className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (userError) {
    return (
      <p className="text-sm text-red-600">
        Could not load your privacy settings. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* قسم الخصوصية الأساسي */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="mb-5 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-900">
              Privacy & Security
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Control who can see your profile and posts.
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-[#FAFAFA] p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">Private account</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              When your account is private, only people you approve can follow you
              and see your posts. Your current profile is{" "}
              <span className="font-medium text-gray-800">
                {isPrivate ? "private" : "public"}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isPrivate}
            aria-label="Private account"
            disabled={isToggling}
            onClick={() => togglePrivacy()}
            className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isPrivate ? "bg-gray-900" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                isPrivate ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {toggleError && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
            {getErrorMessage(toggleError)}
          </div>
        )}
      </section>

      {/* قسم إدارة البلوكات (Blocked Users) */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="mb-5 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <UserX className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-900">Blocked Accounts</h2>
            <p className="mt-1 text-xs text-gray-400">
              Manage users you have blocked from interacting with you.
            </p>
          </div>
        </div>

        {isLoadingBlocked ? (
          <div className="flex justify-center py-8">
            <LoaderIcon className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : isBlockedError ? (
          <p className="text-sm text-red-600">
            Could not load blocked users. Please try again.
          </p>
        ) : blockedUsers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-xs text-gray-500">No blocked accounts found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map((user) => {
              const isUnblocking = unblockingId === user.id;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#FAFAFA] p-3.5"
                >
                  <div className="flex items-center gap-3">
                    {/* مكان الصورة مع التأكد من وجود الـ relative و overflow-hidden */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                      {user.avatar ? (
                        <Image
                          fill
                          unoptimized
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">@{user.user_name}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isUnblocking}
                    onClick={() => unblockUser(user.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUnblocking ? (
                      <>
                        <LoaderIcon className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Unblocking...
                      </>
                    ) : (
                      "Unblock"
                    )}
                  </button>
                </div>
              );
            })}

            {hasNextPage && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs font-medium text-gray-600 hover:underline disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more blocked users"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}