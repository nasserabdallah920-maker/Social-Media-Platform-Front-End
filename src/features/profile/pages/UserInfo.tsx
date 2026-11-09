"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";
import { UserProfile } from "../interfaces/profileInterfaces";
import UserAvatar from "./UserAvatar";
import UserActions from "./UserActions";

interface UserInfoProps {
  user: UserProfile;
  isOwner?: boolean;
}

export default function UserInfo({ user, isOwner }: UserInfoProps) {
  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id
  );
  const resolvedIsOwner = isOwner ?? currentUserId === user.id;
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-16 pb-10 bg-white sm:bg-transparent rounded-3xl sm:rounded-none p-6 sm:p-0 shadow-sm sm:shadow-none border border-gray-100 sm:border-none relative">
      {/* Profile Avatar & Change Avatar Button */}
      <UserAvatar
        avatar={user.avatar}
        fullName={fullName}
        isOwner={resolvedIsOwner}
      />

      {/* User Actions, Stats & Bio */}
      <UserActions
        user={user}
        isOwner={resolvedIsOwner}
      />
    </div>
  );
}
