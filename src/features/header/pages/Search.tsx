"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  X,
  Loader2,
  User,
  MessageSquare,
  Heart,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";
import { useSearch } from "@/features/search/hooks/useSearch";
import { SearchUser, SearchPost } from "@/features/search/interfaces/searchInterfaces";
import { getMediaUrl } from "@/utils/getMediaUrl";

type FilterTab = "all" | "users" | "posts";

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce input to reduce redundant requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { users, posts, isLoading, isFetching } = useSearch(debouncedQuery);

  // Handle click outside to close dropdown and mobile search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = (userId: number) => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
    setSearchTerm("");
    router.push(`/profile/${userId}`);
  };

  const handlePostClick = (postId: number) => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
    setSearchTerm("");
    router.push(`/post/${postId}`);
  };

  const showUsers = activeTab === "all" || activeTab === "users";
  const showPosts = activeTab === "all" || activeTab === "posts";

  const totalResults =
    activeTab === "all"
      ? users.length + posts.length
      : activeTab === "users"
      ? users.length
      : posts.length;

  const showDropdown = isDropdownOpen && debouncedQuery.trim().length > 0;

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* 1. Mobile toggle icon */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 sm:hidden rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* 2. Search Container */}
      <div
        className={`
          transition-all duration-200
          ${
            isMobileOpen
              ? "fixed inset-0 h-full w-full z-50 flex items-center bg-white px-3 sm:static sm:h-auto sm:w-auto sm:bg-transparent sm:px-0 sm:z-auto"
              : "hidden sm:block"
          }
        `}
      >
        <div className="relative w-full sm:w-80">
          {/* Search Left Icon */}
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />

          {/* Input field */}
          <input
            type="text"
            value={searchTerm}
            autoFocus={isMobileOpen}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Search users or posts..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 sm:bg-gray-50/80 pl-10 pr-16 sm:pr-9 py-2.5 sm:py-2 text-sm sm:text-xs text-gray-800 placeholder-gray-400 shadow-sm sm:shadow-none transition-all focus:border-gray-300 focus:bg-white focus:outline-none"
          />

          {/* Right Action Icons (Clear / Close / Loading) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isLoading || isFetching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
            ) : searchTerm ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedQuery("");
                }}
                className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false);
                setIsDropdownOpen(false);
              }}
              className="sm:hidden p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 3. Dropdown Results */}
          {showDropdown && (
            <div className="fixed inset-x-2 top-14 max-h-[calc(100vh-4.5rem)] sm:absolute sm:inset-x-0 sm:top-full sm:max-h-[78vh] mt-2 overflow-y-auto rounded-2xl border border-gray-150 bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Filter Tabs Header */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>All</span>
                  <span className="text-[10px] opacity-60">
                    ({users.length + posts.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "users"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Users className="h-3 w-3" />
                  <span>Users</span>
                  <span className="text-[10px] opacity-60">({users.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "posts"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Posts</span>
                  <span className="text-[10px] opacity-60">({posts.length})</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                  <span className="text-xs">Searching...</span>
                </div>
              ) : totalResults === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <p className="text-xs font-medium text-gray-600">
                    No results found
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    No matches in {activeTab} for &quot;{debouncedQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Users Section */}
                  {showUsers && users.length > 0 && (
                    <div className="pb-2.5">
                      {activeTab === "all" && (
                        <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Users ({users.length})
                        </div>
                      )}
                      <div className="space-y-1 mt-1">
                        {users.map((user: SearchUser) => {
                          const fullName = `${user.first_name || ""} ${
                            user.last_name || ""
                          }`.trim();

                          return (
                            <div
                              key={user.id}
                              onClick={() => handleUserClick(user.id)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-xs overflow-hidden">
                                {user.avatar ? (
                                  <Image
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    src={getMediaUrl(user.avatar)}
                                    alt={user.user_name}
                                  />
                                ) : (
                                  <User className="h-4 w-4 text-gray-300" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                  {user.user_name}
                                </p>
                                {fullName && (
                                  <p className="text-[10px] text-gray-400 truncate">
                                    {fullName}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Posts Section */}
                  {showPosts && posts.length > 0 && (
                    <div className={activeTab === "all" && users.length > 0 ? "pt-2.5" : ""}>
                      {activeTab === "all" && (
                        <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Posts ({posts.length})
                        </div>
                      )}
                      <div className="space-y-1.5 mt-1">
                        {posts.map((post: SearchPost) => (
                          <div
                            key={post.id}
                            onClick={() => handlePostClick(post.id)}
                            className="p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-[9px] overflow-hidden">
                                {post.avatar ? (
                                  <Image
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    src={getMediaUrl(post.avatar)}
                                    alt={post.user_name}
                                  />
                                ) : (
                                  <User className="h-3 w-3 text-gray-300" />
                                )}
                              </div>
                              <span className="text-xs font-medium text-gray-800 truncate">
                                {post.user_name}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-auto shrink-0">
                                {new Date(post.created_at).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                              {post.text || (
                                <span className="italic text-gray-400">
                                  Photo / Media Post
                                </span>
                              )}
                            </p>

                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likes_count || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {post.comments_count || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
