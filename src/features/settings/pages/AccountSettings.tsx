"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, LoaderIcon, X, KeyRound } from "lucide-react";
import axios from "axios";
import { validator } from "@/utils/validator";
import { accountInfoSchema } from "../validation"; // يمكنك إضافة validation للباسورد هنا لو حابب
import { useAccountSettings } from "../hooks/useAccountSettings";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      fallback
    );
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function AccountSettings() {
  const {
    user,
    isLoadingUser,
    userError,
    updateInfo,
    isUpdating,
    updateError,
    isUpdateSuccess,
    changePassword,
    isChangingPassword,
    changePasswordError,
    isPasswordChangeSuccess,
    deleteAccount,
    isDeleting,
    deleteError,
  } = useAccountSettings();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // States لتغيير الباسورد
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setUserName(user.user_name ?? "");
  }, [user]);

  const handleSave = () => {
    setFormError(null);
    const body = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      user_name: userName.trim(),
    };
    const result = validator(accountInfoSchema, body);
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    updateInfo(body);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!oldPassword || !newPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    changePassword(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setOldPassword("");
          setNewPassword("");
        },
      }
    );
  };

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
        Could not load your account details. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* قسم تفاصيل الحساب */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="mb-5">
          <h2 className="text-base font-medium text-gray-900">Account details</h2>
          <p className="mt-1 text-xs text-gray-400">
            Update your username and name.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
              placeholder="johndoe"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="John"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          {(formError || updateError) && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
              {formError ||
                getErrorMessage(updateError, "Could not update your details.")}
            </div>
          )}

          {isUpdateSuccess && !formError && !updateError && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-xs text-green-700">
              Your details were updated.
            </div>
          )}

          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex min-h-10.5 items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? (
              <LoaderIcon className="h-5 w-5 animate-spin" />
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      </section>

      {/* قسم تغيير كلمة المرور */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="mb-5 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-900">Change password</h2>
            <p className="mt-1 text-xs text-gray-400">
              Ensure your account is using a secure password.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handlePasswordChange}>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Current password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {(passwordError || changePasswordError) && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
              {passwordError ||
                getErrorMessage(changePasswordError, "Could not change password.")}
            </div>
          )}

          {isPasswordChangeSuccess && !passwordError && !changePasswordError && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-xs text-green-700">
              Password changed successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex min-h-10.5 items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChangingPassword ? (
              <LoaderIcon className="h-5 w-5 animate-spin" />
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </section>

      {/* قسم حذف الحساب */}
      <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="mb-4">
          <h2 className="text-base font-medium text-red-700">Delete account</h2>
          <p className="mt-1 text-xs text-gray-500">
            Permanently remove your account and everything attached to it.
          </p>
        </div>
        {deleteError && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
            {getErrorMessage(deleteError, "Could not delete your account.")}
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Delete account
        </button>
      </section>

      {/* نافذة التأكيد بالحذف */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-xl">
            <div className="relative mb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="absolute right-0 top-0 rounded-lg p-1 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Delete your account?
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              This cannot be undone. You will lose all of your data, including
              posts, comments, replies, messages, and profile information.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteAccount()}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}