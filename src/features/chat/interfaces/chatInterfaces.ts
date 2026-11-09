export interface Conversation {
  id: number;
  type: "direct" | "group" | string;
  name?: string | null;
  created_at: string;
  avatar: string | null;
  user_name?: string | null;
  text: string | null;
  sent_at: string | null;
  sender_id: number | null;
  unreaded: number;
  user_id?: number | null;
  file_url?: string | null;
  media_type?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  isNew?: boolean;
}

export interface ChatMessage {
  id: number;
  message_id?: number;
  sender_id: number;
  sender_name?: string | null;
  user_name?: string | null;
  sender_avatar?: string | null;
  text: string | null;
  conversation_id: number;
  sent_at: string;
  status: "sent" | "delivered" | "seen" | "read" | string;
  file_url: string | null;
  media_type: "image" | "video" | "audio" | "document" | "raw" | string | null;
  public_id?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  user_id?: number | null;
}

export interface SendMessagePayload {
  conversation_id?: number | null;
  to_user_id: number;
  conversation_type: string;
  text?: string;
  file?: File;
}

export interface CreateGroupPayload {
  name: string;
  users: (number | string)[];
  avatar?: File;
}

export interface UpdateConversationPayload {
  conversation_id: number;
  name?: string;
  avatar?: File;
}

export interface AddMembersPayload {
  conversation_id: number;
  users: (number | string)[];
}

export interface RemoveMemberPayload {
  conversation_id: number;
  member_id: number | string;
}

export interface GroupMember {
  user_id: number;
  role: "admin" | "member" | string;
  user_name: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar: string | null;
}

export interface GroupDetails {
  id: number;
  type: "group" | "direct" | string;
  name?: string | null;
  avatar: string | null;
  members: GroupMember[];
}
