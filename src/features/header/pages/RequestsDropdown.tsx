"use client";
import { useRef } from "react";
import { useHeader } from "../hooks/useHeader";
import { handleScroll } from "@/utils/handleScroll";
import Image from "next/image";
import { Check, Loader2, User, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setBadge } from "@/lib/RTK/badgeSlice";
import { UserRequests } from "../interfaces/headerInterfaces";

export default function RequestsDropdown({ open }: { open: string | null }) {
  const {
    hasNextRequests,
    isFetchingNextRequests,
    fetchNextRequests,
    userRequests,
    acceptRequest,
    badge,
    rejectRequest,
  } = useHeader();
  const requestsScrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  return (
    <div>
      {open === "Requests" && (
        <div
          ref={requestsScrollRef}
          onScroll={(e) =>
            handleScroll(
              e,
              hasNextRequests,
              isFetchingNextRequests,
              fetchNextRequests,
            )
          }
          className="fixed inset-x-2 top-16 sm:absolute sm:inset-x-auto sm:top-full sm:left-1/2 z-50 mt-1 sm:mt-3 flex max-h-[80vh] w-auto sm:w-96 sm:-translate-x-1/2 flex-col gap-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md transition-all duration-200"
        >
          <div className="border-b border-gray-100 pb-2 text-xs font-semibold text-gray-400">
            Follow Requests
          </div>

          {userRequests && userRequests.length > 0 ? (
            <>
              {userRequests.map((item: UserRequests, index: number) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white">
                      {item.avatar ? (
                        <Image
                          alt={item.user_name || "User avatar"}
                          src={`${process.env.NEXT_PUBLIC_API_URL}${item.avatar}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm leading-snug text-gray-800">
                        <span className="font-semibold text-gray-900">
                          {item.user_name}
                        </span>
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        sent a follow request.
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Accept request"
                      onClick={() => {
                        acceptRequest(
                        item.id,
                        );
                        dispatch(
                          setBadge([
                            {
                              title: "Requests",
                              count: Math.max(0, badge.Requests - 1),
                            },
                          ]),
                        );
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-white transition-all hover:bg-gray-800 active:scale-95"
                    >
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      aria-label="Decline request"
                      onClick={() => {
                        rejectRequest(
                           item.id,
                        );
                        dispatch(
                          setBadge([
                            {
                              title: "Requests",
                              count: Math.max(0, badge.Requests - 1),
                            },
                          ]),
                        );
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 active:scale-95"
                    >
                      <X className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}

              {isFetchingNextRequests && (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}

              {hasNextRequests && !isFetchingNextRequests && (
                <button
                  onClick={() => fetchNextRequests()}
                  className="mx-auto block rounded-lg px-4 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  Load more
                </button>
              )}
            </>
          ) : (
            <p className="py-2 text-center text-xs text-gray-400">
              No pending requests
            </p>
          )}
        </div>
      )}
    </div>
  );
}
