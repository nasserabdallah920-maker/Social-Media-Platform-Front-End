"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Camera, Loader2 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { getMediaUrl } from "@/utils/getMediaUrl";

interface UserAvatarProps {
  avatar: string | null;
  fullName: string;
  isOwner: boolean;
}

export default function UserAvatar({
  avatar: initialAvatar,
  fullName,
  isOwner,
}: UserAvatarProps) {
  const [avatar, setAvatar] = useState(initialAvatar);
  const { updateAvatarMutation } = useProfile();

  useEffect(() => {
    setAvatar(initialAvatar);
  }, [initialAvatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatarMutation.mutate(file, {
        onSuccess: (res) => {
          const newAvatar = res.data?.avatar || URL.createObjectURL(file);
          setAvatar(newAvatar);
        },
      });
    }
  };

  const isUploading = updateAvatarMutation.isPending;

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="relative flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 shadow-sm">
        {avatar ? (
          <Image
            alt={fullName}
            src={getMediaUrl(avatar)}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <User className="h-12 w-12 text-gray-400" />
        )}
      </div>

      {isOwner && (
        <label className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm">
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
          <span>{isUploading ? "Uploading..." : "Change Avatar"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
