"use client";

import Image from "next/image";
import { User, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFollowing } from "../hooks/useFollowing";
import { useEffect } from "react";
export default function UsersFeed({ id ,type}:{id:number,type:string}) {
  const { followingData, fetchNextPage, hasNextPage, isFetching } =
    useFollowing(id,type);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const { clientHeight, scrollTop, scrollHeight } =
        document.documentElement;


      if (
        scrollHeight - scrollTop - clientHeight<500 &&
        hasNextPage &&
        !isFetching
      ) {
        fetchNextPage();
      }
    });
  }, [hasNextPage,fetchNextPage,isFetching]);

  const users = followingData?.pages.flatMap((page) => page.data);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      {/* Feed Container */}
      <div className="mx-auto max-w-xl w-full flex flex-col gap-4">
        {/* Feed Header */}
        <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            {type} Users
          </h1>
        </div>

        {/* Feed Items List */}
        {users && users.length > 0 ? (
          users.map((user) => {
            const fullName = `${user.first_name} ${user.last_name}`;

            return (
              <div
                key={user.id}
                className="group relative flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                {/* User Info Section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Avatar with Story-style Gradient Ring */}
                  <div className="relative p-0.5 rounded-full bg-linear-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0 shadow-sm">
                    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white">
                      {user.avatar ? (
                        <Image
                          alt={fullName}
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                          <User className="h-7 w-7" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & Username */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-gray-900 truncate leading-snug group-hover:text-purple-600 transition-colors">
                      {fullName}
                    </h2>
                    <p className="text-xs font-medium text-gray-400 truncate mt-0.5">
                      @{user.user_name}
                    </p>
                  </div>
                </div>

                {/* Right Action Arrow */}
                <div
                  onClick={() => router.push(`/profile/${user.id}`)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-500 mb-3">
              <User className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              No users found
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              There are no suggested users to show right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
