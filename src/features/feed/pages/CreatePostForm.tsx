"use client";
import { useState, useRef } from "react";
import { ImagePlus, X, Loader2, Send, FileText, Video } from "lucide-react";
import { usePosts } from "../hooks/usePost";
import Image from "next/image";

interface PreviewItem {
  url: string;
  type: "image" | "video" | "document";
  name: string;
}

export default function CreatePostForm() {
  const { createPost, isCreatingPost } = usePosts();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);

    // Generate previews
    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      let type: "image" | "video" | "document" = "image";
      if (file.type.startsWith("video/")) type = "video";
      else if (!file.type.startsWith("image/")) type = "document";

      setPreviews((prev) => [...prev, { url, type, name: file.name }]);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!text.trim() && files.length === 0) return;

    createPost(
      {
        text: text.trim(),
        post_files: files.length > 0 ? files : undefined,
      },
      {
        onSuccess: () => {
          setText("");
          setFiles([]);
          setPreviews([]);
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-200">
      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-all"
      />

      {/* Media previews */}
      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {previews.map((item, i) => (
            <div
              key={i}
              className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-100 group bg-gray-50 flex items-center justify-center"
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-black/80 flex items-center justify-center relative">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <Video className="w-5 h-5 text-white absolute" />
                </div>
              ) : item.type === "document" ? (
                <div className="flex flex-col items-center justify-center p-1 text-center">
                  <FileText className="w-6 h-6 text-blue-500 mb-1" />
                  <span className="text-[9px] text-gray-600 truncate max-w-[70px]">
                    {item.name}
                  </span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`Preview ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <div className="mt-3 flex items-center justify-between">
        {/* File picker */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <ImagePlus className="h-4 w-4" />
          <span>Photo / Video / File</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={(e) => handleFilesChange(e.target.files)}
          className="hidden"
        />

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isCreatingPost || (!text.trim() && files.length === 0)}
          className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          {isCreatingPost ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              <span>Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
