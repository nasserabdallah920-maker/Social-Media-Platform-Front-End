"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Download, FileText } from "lucide-react";
import Image from "next/image";
import { MediaItem } from "../interfaces/postInterfaces";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { getMediaType } from "@/utils/mediaHelper";

interface ShowImagesProps {
  images: MediaItem[];
  currentId: number;
  onClose: () => void;
}

export default function ShowImages({ images, currentId, onClose }: ShowImagesProps) {
  const initialIndex = images.findIndex((img) => img.id === currentId);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    const index = images.findIndex((img) => img.id === currentId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentId, images]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  if (!images || images.length === 0) return null;

  const currentMedia = images[currentIndex];
  const mediaUrl = getMediaUrl(currentMedia.url);
  const mediaType = getMediaType(currentMedia);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={() => onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-6 left-6 text-white/80 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 backdrop-blur-md cursor-pointer"
          aria-label="Previous media"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {mediaType === "video" ? (
          <video
            key={mediaUrl}
            src={mediaUrl}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl bg-black"
          />
        ) : mediaType === "document" || mediaType === "raw" ? (
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 break-all">
                {currentMedia.file_name || "Document"}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                This document cannot be previewed directly.
              </p>
            </div>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={currentMedia.file_name || true}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          </div>
        ) : mediaType === "audio" ? (
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 min-w-[320px]">
            <p className="text-sm font-medium text-gray-800">
              {currentMedia.file_name || "Audio Track"}
            </p>
            <audio src={mediaUrl} controls autoPlay className="w-full" />
          </div>
        ) : (
          <Image
            fill
            unoptimized
            src={mediaUrl}
            alt={currentMedia.file_name || `Gallery image ${currentIndex + 1}`}
            className="object-contain rounded-xl shadow-2xl transition-all duration-300"
          />
        )}
      </div>

      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 backdrop-blur-md cursor-pointer"
          aria-label="Next media"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
