"use client";
import { LoaderCircle, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useHeader } from "../hooks/useHeader";
import { getMediaUrl } from "@/utils/getMediaUrl";
import cookie from "universal-cookie";
const useCookie = new cookie();
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";
import { useEffect, useRef } from "react";

export default function LeftNav() {
  const { avatarPending, data, openSettings, setOpenSettings, logOut } =
    useHeader();
  const avatar = data?.data?.avatar ?? null;
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.user.user_id);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogOut = async () => {
    const res = await logOut();
    if (res.status === 200) {
      useCookie.remove("access_token");
      router.push("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenSettings]);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/profile/${userId}`}
        className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-50"
      >
        {avatar ? (
          avatarPending ? (
            <LoaderCircle className="text-white animate-spin" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={getMediaUrl(avatar)}
              alt="User Avatar"
            />
          )
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-medium">
            <User className="h-4 w-4" />
          </div>
        )}

        <span className="text-xs font-medium text-gray-700 hidden sm:inline">
          Profile
        </span>
      </Link>

      {/* حاوية زر الإعدادات والقائمة المستقلة تماماً */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpenSettings(!openSettings)}
          aria-label="Settings Menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors ${
            openSettings ? "bg-gray-50 text-gray-900" : ""
          } hover:bg-gray-50 hover:text-gray-900 focus:outline-none`}
        >
          <Settings className="h-5 w-5" />
        </button>

        {openSettings && (
          <div className="absolute right-0 sm:-right-15 mt-2.5 w-48 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-[0_10px_30px_rgb(0,0,0,0.08)] z-50">
            <div className="absolute -top-1.5 right-4 sm:right-18 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white"></div>

            <ul className="relative z-10 space-y-0.5 text-xs font-medium text-gray-700">
              <li>
                <Link
                  href="/settings/account"
                  onClick={() => setOpenSettings(false)}
                  className="flex w-full items-center px-3 py-2 rounded-xl transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Account Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/settings/security"
                  onClick={() => setOpenSettings(false)}
                  className="flex w-full items-center px-3 py-2 rounded-xl transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Privacy & Security
                </Link>
              </li>

              {/* خط فاصل */}
              <li className="my-1 border-t border-gray-100"></li>

              {/* زر تسجيل الخروج */}
              <li>
                <button
                  type="button"
                  onClick={handleLogOut}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}