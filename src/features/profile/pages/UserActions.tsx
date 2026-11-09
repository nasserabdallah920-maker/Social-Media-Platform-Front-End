"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Clock,
  MoreHorizontal,
  UserCheck,
  UserPlus,
  UserMinus,
  Ban,
  MessageSquare,
} from "lucide-react";
import UserStats from "./UserStats";
import UserBio from "./UserBio";
import ConfirmationModal from "@/components/ConfirmationModal";
import { UserProfile } from "../interfaces/profileInterfaces";
import { useProfile } from "../hooks/useProfile";
import { openChatWithUser, setActiveConversation } from "@/lib/RTK/chatSlice";
import { useConversations } from "@/features/chat/hooks/useConversations";

interface UserActionsProps {
  user: UserProfile;
  isOwner: boolean;
}

export default function UserActions({ user, isOwner }: UserActionsProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState<UserProfile>(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { followMutation, unfollowMutation, blockMutation } = useProfile();
  const { conversations } = useConversations();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserProfile(user);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFollow = () => {
    followMutation.mutate(userProfile.id, {
      onSuccess: (res) => {
        if (res.data.message === "User followed successfully") {
          setUserProfile((prev) => ({
            ...prev,
            is_following: 1,
            is_requested: 0,
            followers_count: prev.followers_count + 1,
          }));
        } else if (res.data.message === "Follow request sent successfully") {
          setUserProfile((prev) => ({
            ...prev,
            is_requested: 1,
            is_following: 0,
          }));
        }
      },
    });
  };

  const handleUnFollow = () => {
    unfollowMutation.mutate(userProfile.id, {
      onSuccess: () => {
        setUserProfile((prev) => ({
          ...prev,
          is_following: 0,
          is_requested: 0,
          followers_count: Math.max(0, prev.followers_count - 1),
        }));
      },
    });
  };

  const handleConfirmBlock = () => {
    blockMutation.mutate(userProfile.id, {
      onSuccess: () => {
        setIsBlockModalOpen(false);
        router.push("/");
      },
    });
  };

  const handleOpenMessages = () => {
    // البحث عن المحادثة الحالية مع هذا الشخص إن وجدت
    const existingConv = conversations.find(
      (c) =>
        c.user_name === userProfile.user_name ||
        c.sender_id === userProfile.id ||
        c.user_id === userProfile.id
    );

    if (existingConv) {
      // محادثة موجودة سابقة -> يتم فتحها بالـ conversation_id الخاص بها
      dispatch(setActiveConversation(existingConv));
    } else {
      // لا توجد محادثة سابقة مع هذا الشخص -> يتم فتح نافذة محادثة جديدة بدون conversation_id
      dispatch(
        openChatWithUser({
          conversation_id: null,
          user_id: userProfile.id,
          user_name: userProfile.user_name,
          avatar: userProfile.avatar,
        })
      );
    }
  };

  const fullName = `${userProfile.first_name} ${userProfile.last_name}`;

  return (
    <div className="flex-1 min-w-0 w-full text-center sm:text-left">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-normal text-gray-900 truncate">
          {userProfile.user_name}
        </h1>

        {!isOwner && (
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            {/* Follow / Unfollow Button */}
            <button
              type="button"
              onClick={handleFollow}
              disabled={followMutation.isPending}
              className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                userProfile.is_following === 1
                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  : userProfile.is_requested === 1
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {userProfile.is_following === 1 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <UserCheck className="h-4 w-4" /> Following
                </span>
              ) : userProfile.is_requested === 1 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4" /> Requested
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <UserPlus className="h-4 w-4" /> Follow
                </span>
              )}
            </button>

            {/* Message Button */}
            <button
              type="button"
              onClick={handleOpenMessages}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <MessageSquare className="h-4 w-4 text-gray-700" />
              <span>Message</span>
            </button>

            {(userProfile.is_following === 1 ||
              userProfile.is_requested === 1) && (
              <button
                type="button"
                onClick={handleUnFollow}
                disabled={unfollowMutation.isPending}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-900 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95 shadow-sm cursor-pointer"
              >
                <UserMinus className="h-4 w-4" />
                Unfollow
              </button>
            )}

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all shadow-sm cursor-pointer"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsBlockModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Block User</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <UserStats user={userProfile} isOwner={isOwner} />

      {/* Bio Section */}
      <UserBio
        fullName={fullName}
        bio={userProfile.bio}
        isOwner={isOwner}
      />

      {/* Confirmation Modal for Block */}
      <ConfirmationModal
        isModalOpen={isBlockModalOpen}
        setIsModalOpen={setIsBlockModalOpen}
        handleConfirm={handleConfirmBlock}
        isPending={blockMutation.isPending}
        title={`Block ${userProfile.user_name}?`}
        message="This user will no longer be able to view your profile or contact you. Are you sure you want to block them?"
      />
    </div>
  );
}
