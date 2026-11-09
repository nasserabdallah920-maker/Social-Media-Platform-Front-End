import { getMediaUrl } from "@/utils/getMediaUrl";
import { Plus, X, FileText, Video } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePost } from "../hooks/usePost";
import { MediaItem, Post } from "@/features/feed/interfaces/postInterfaces";
import { getMediaType } from "@/utils/mediaHelper";

export default function EditPostModal({
  setIsMenuOpen,
  post,
  setCurrentImages,
  setIsEditModalOpen,
  currentImages,
  isEditModalOpen,
}: {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentImages: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditModalOpen: boolean;
  currentImages: MediaItem[];
  post: Post;
}) {
  const [editedText, setEditedText] = useState<string>(post.text);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newFilesPreviews, setNewFilesPreviews] = useState<
    { url: string; type: string; name: string }[]
  >([]);

  const { updatePostText, deletePostFile, updatePostFiles } = usePost();

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);

      const previewsArray = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("image/")
          ? "image"
          : "document",
        name: file.name,
      }));
      setNewFilesPreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const handleDeleteExistingImage = (
    postId: number,
    fileId: number,
    file_url: string,
  ) => {
    deletePostFile.mutate(
      { postId, file_url },
      {
        onSuccess: () => {
          setCurrentImages((prev) => prev.filter((img) => img.id !== fileId));
        },
      },
    );
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewFilesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEdit = async () => {
    if (editedText !== post.text) {
      updatePostText.mutate({ id: post.id, text: editedText });
    }

    if (newFiles.length > 0) {
      updatePostFiles.mutate({ id: post.id, files: newFiles });
    }

    setIsEditModalOpen(false);
    setIsMenuOpen(false);
    setNewFiles([]);
    setNewFilesPreviews([]);
  };

  return (
    <div>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Post</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Edit Text */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Post Text
              </label>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                rows={3}
              />
            </div>

            {/* Existing Media Management */}
            {currentImages.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Current Media
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {currentImages.map((item: MediaItem) => {
                    const mediaType = getMediaType(item);
                    return (
                      <div
                        key={item.id}
                        className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center"
                      >
                        {mediaType === "video" ? (
                          <div className="w-full h-full bg-black/80 flex items-center justify-center relative">
                            <video
                              src={getMediaUrl(item.url)}
                              className="w-full h-full object-cover pointer-events-none"
                            />
                            <Video className="w-5 h-5 text-white absolute" />
                          </div>
                        ) : mediaType === "document" || mediaType === "raw" ? (
                          <div className="flex flex-col items-center justify-center p-2 text-center">
                            <FileText className="w-6 h-6 text-blue-500 mb-1" />
                            <span className="text-[10px] text-gray-600 truncate max-w-[80px]">
                              {item.file_name || "Doc"}
                            </span>
                          </div>
                        ) : (
                          <Image
                            src={getMediaUrl(item.url)}
                            alt="Post media"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteExistingImage(post.id, item.id, item.url)
                          }
                          disabled={deletePostFile.isPending}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity z-10"
                          title="Delete Media"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Media */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Add New Media
              </label>
              <div className="flex flex-wrap gap-2">
                {newFilesPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
                  >
                    {preview.type === "video" ? (
                      <div className="w-full h-full bg-black/80 flex items-center justify-center relative">
                        <video
                          src={preview.url}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                        <Video className="w-5 h-5 text-white absolute" />
                      </div>
                    ) : preview.type === "document" ? (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <FileText className="w-6 h-6 text-blue-500 mb-1" />
                        <span className="text-[10px] text-gray-600 truncate max-w-[80px]">
                          {preview.name}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={preview.url}
                        alt="New preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-gray-400 hover:text-blue-500">
                  <Plus className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-medium">Add Media</span>
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    multiple
                    className="hidden"
                    onChange={handleNewImagesChange}
                  />
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="py-2 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={updatePostText.isPending || updatePostFiles.isPending}
                className="py-2 px-6 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {updatePostText.isPending || updatePostFiles.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
