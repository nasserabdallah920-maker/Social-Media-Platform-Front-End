import { MediaItem } from "@/features/feed/interfaces/postInterfaces";

export type DetectedMediaType = "image" | "video" | "audio" | "document" | "raw";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".mkv", ".avi", ".m4v"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif"];
const DOC_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv"];

export function getMediaType(item?: Partial<MediaItem> | null): DetectedMediaType {
  if (!item) return "image";

  const rawType = (item.media_type || "").toLowerCase().trim();

  if (rawType.includes("video") || rawType === "vd") return "video";
  if (rawType.includes("audio")) return "audio";
  if (rawType.includes("image") || rawType === "img") return "image";
  if (rawType.includes("doc") || rawType.includes("pdf") || rawType === "document") return "document";

  // Check URL / filename extension
  const candidate = (item.file_name || item.url || "").toLowerCase().split("?")[0];

  if (VIDEO_EXTENSIONS.some((ext) => candidate.endsWith(ext))) return "video";
  if (AUDIO_EXTENSIONS.some((ext) => candidate.endsWith(ext))) return "audio";
  if (IMAGE_EXTENSIONS.some((ext) => candidate.endsWith(ext))) return "image";
  if (DOC_EXTENSIONS.some((ext) => candidate.endsWith(ext))) return "document";

  // Check if cloudinary URL specifies /video/upload/ or /image/upload/ or /raw/upload/
  if (item.url) {
    if (item.url.includes("/video/upload/")) return "video";
    if (item.url.includes("/image/upload/")) return "image";
    if (item.url.includes("/raw/upload/")) return "document";
  }

  return "image";
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

