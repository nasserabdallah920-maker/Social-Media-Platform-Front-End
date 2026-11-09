
import { getMediaType } from "@/utils/mediaHelper";

export function getConversationDisplayName(conv: Record<string, any>): string {
  if (conv.name && String(conv.name).trim() !== "") {
    return String(conv.name).trim();
  }
  if (conv.user_name && String(conv.user_name).trim() !== "") {
    return String(conv.user_name).trim();
  }
  if (conv.type === "group") {
    return "Group Chat";
  }
  return "Chat";
}

export function formatLastMessagePreview(conv: Record<string, any>): {
  label: string;
  isMedia: boolean;
} {
  const text = conv.text ?? conv.last_message_text ?? conv.last_message;

  if (text !== null && text !== undefined && String(text).trim() !== "") {
    return { label: String(text), isMedia: false };
  }

  const fileUrl =
    conv.file_url ??
    conv.fileUrl ??
    conv.url ??
    conv.media_url ??
    conv.last_message_file_url ??
    conv.file;

  const mediaType =
    conv.media_type ??
    conv.mediaType ??
    conv.type_of_file ??
    conv.last_message_media_type;

  const fileName =
    conv.file_name ??
    conv.fileName ??
    conv.name ??
    conv.last_message_file_name;

  if (fileUrl || mediaType) {
    const type = getMediaType({
      media_type: mediaType || undefined,
      url: typeof fileUrl === "string" ? fileUrl : undefined,
      file_name: fileName || undefined,
    });

    switch (type) {
      case "video":
        return { label: "🎥 Video", isMedia: true };
      case "image":
        return { label: "📷 Photo", isMedia: true };
      case "audio":
        return { label: "🎵 Audio", isMedia: true };
      case "document":
      case "raw":
        return {
          label: fileName ? `📄 ${fileName}` : "📄 File attachment",
          isMedia: true,
        };
      default:
        return { label: "📎 Attachment", isMedia: true };
    }
  }

  const hasSentMessage =
    Boolean(conv.sent_at) ||
    Boolean(conv.last_message_at) ||
    conv.sender_id !== null && conv.sender_id !== undefined;

  if (hasSentMessage && (text === "" || text === null)) {
    return { label: "📎 Attachment", isMedia: true };
  }

  return { label: "No messages yet", isMedia: false };
}
