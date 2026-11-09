"use client";

import Image from "next/image";
import { MediaItem } from "../interfaces/postInterfaces";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { getMediaType, formatFileSize } from "@/utils/mediaHelper";
import { Play, FileText, Download } from "lucide-react";

interface MediaPreviewProps {
  item: MediaItem;
  className?: string;
  showOverlayIcon?: boolean;
}

export function MediaThumbnail({ item, className = "", showOverlayIcon = true }: MediaPreviewProps) {
  const type = getMediaType(item);
  const mediaUrl = getMediaUrl(item.url);

  if (type === "video") {
    return (
      <div className={`relative w-full h-full bg-black/90 flex items-center justify-center overflow-hidden ${className}`}>
        <video
          src={mediaUrl}
          preload="metadata"
          className="w-full h-full object-cover pointer-events-none"
        />
        {showOverlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-900 shadow-md">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (type === "document" || type === "raw") {
    return (
      <div className={`relative w-full h-full bg-gray-50 border border-gray-100 p-4 flex flex-col items-center justify-center text-center gap-2 ${className}`}>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div className="max-w-full px-2">
          <p className="text-xs font-semibold text-gray-800 truncate" title={item.file_name || "Document"}>
            {item.file_name || "Document attachment"}
          </p>
          {item.file_size ? (
            <span className="text-[10px] text-gray-400 font-medium">
              {formatFileSize(item.file_size)}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (type === "audio") {
    return (
      <div className={`relative w-full h-full bg-gray-100 flex items-center justify-center p-3 ${className}`}>
        <audio controls src={mediaUrl} className="w-full max-w-xs" onClick={(e) => e.stopPropagation()} />
      </div>
    );
  }

  // Fallback / Image
  return (
    <Image
      fill
      unoptimized
      className="object-cover"
      src={mediaUrl}
      alt={item.file_name || "Media attachment"}
    />
  );
}

interface RenderImageGridProps {
  images: MediaItem[];
  setCurrentId: (id: number) => void;
  setImages: (images: MediaItem[]) => void;
  setOpen: (open: boolean) => void;
}

export default function RenderImageGrid({
  images,
  setCurrentId,
  setImages,
  setOpen,
}: RenderImageGridProps) {
  if (!images || images.length === 0) return null;

  const totalImages = images.length;
  const displayedImages = images.slice(0, 4);
  const remainingCount = totalImages - 4;

  const handleMediaClick = (item: MediaItem) => {
    const type = getMediaType(item);
    if (type === "document" || type === "raw") {
      // Direct download / open document in new tab
      window.open(getMediaUrl(item.url), "_blank");
      return;
    }
    setCurrentId(item.id);
    setImages(images);
    setOpen(true);
  };

  // Only single document handling
  if (totalImages === 1 && (getMediaType(images[0]) === "document" || getMediaType(images[0]) === "raw")) {
    const doc = images[0];
    const docUrl = getMediaUrl(doc.url);
    return (
      <div className="mb-4">
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-150 rounded-xl hover:bg-gray-100 transition-colors group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate" title={doc.file_name || "Attachment"}>
                {doc.file_name || "Document attachment"}
              </p>
              {doc.file_size ? (
                <p className="text-xs text-gray-400">{formatFileSize(doc.file_size)}</p>
              ) : null}
            </div>
          </div>
          <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors">
            <Download className="w-4 h-4" />
          </div>
        </a>
      </div>
    );
  }

  // Single media
  if (totalImages === 1) {
    const isVideo = getMediaType(images[0]) === "video";
    return (
      <div
        onClick={() => handleMediaClick(images[0])}
        className={`relative mb-4 overflow-hidden rounded-xl border border-gray-100 bg-[#FAFAFA] ${
          isVideo ? "h-[420px]" : "h-96"
        } cursor-pointer`}
      >
        <MediaThumbnail item={images[0]} />
      </div>
    );
  }

  // 2 items
  if (totalImages === 2) {
    return (
      <div className="mb-4 overflow-hidden grid grid-cols-2 gap-1 rounded-xl border border-gray-100 bg-[#FAFAFA] h-64">
        {images.map((img, index) => (
          <div
            key={img.id || index}
            onClick={() => handleMediaClick(img)}
            className="relative overflow-hidden h-full cursor-pointer"
          >
            <MediaThumbnail item={img} />
          </div>
        ))}
      </div>
    );
  }

  // 3 or more items
  return (
    <div className="mb-4 overflow-hidden grid grid-cols-2 gap-1 rounded-xl border border-gray-100 bg-[#FAFAFA] h-72">
      {displayedImages.map((img, index) => {
        const isFourthAndHasMore = index === 3 && remainingCount > 0;
        return (
          <div
            key={img.id || index}
            className="relative overflow-hidden h-full bg-gray-100 cursor-pointer"
            onClick={() => handleMediaClick(img)}
          >
            <div className={`relative w-full h-full ${isFourthAndHasMore ? "brightness-75" : ""}`}>
              <MediaThumbnail item={img} />
            </div>
            {isFourthAndHasMore && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold pointer-events-none">
                +{remainingCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
