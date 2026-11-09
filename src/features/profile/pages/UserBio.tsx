"use client";
import { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";

interface UserBioProps {
  fullName: string;
  bio: string | null;
  isOwner: boolean;
}

export default function UserBio({
  fullName,
  bio: initialBio,
  isOwner,
}: UserBioProps) {
  const [bio, setBio] = useState(initialBio);
  const [bioText, setBioText] = useState(initialBio || "");
  const [isEditing, setIsEditing] = useState(false);
  const { updateBioMutation } = useProfile();

  useEffect(() => {
    setBio(initialBio);
    setBioText(initialBio || "");
  }, [initialBio]);

  const handleSave = () => {
    updateBioMutation.mutate(bioText, {
      onSuccess: () => {
        setBio(bioText);
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    setBioText(bio || "");
    setIsEditing(false);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-900">{fullName}</p>

      {isEditing ? (
        <div className="mt-2 flex flex-col gap-2 max-w-md">
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            rows={2}
            placeholder="Write your bio here..."
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateBioMutation.isPending}
              className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {updateBioMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-0.5">
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {bio || "No bio yet."}
          </p>

          {isOwner && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1 shrink-0"
            >
              <Edit2 className="h-3 w-3" /> {bio ? "Edit Bio" : "Add Bio"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
