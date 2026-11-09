export interface MediaItem {
  id: number;
  url: string;
  media_type?: "image" | "video" | "audio" | "document" | "raw" | string;
  public_id?: string;
  file_name?: string;
  file_size?: number;
}

// Backward compatibility alias
export type ImageItem = MediaItem;

export interface Post {
  id: number;
  user_id: number;
  text: string;
  created_at: string;
  user_name: string;
  avatar?: string;
  likes_count: number;
  comments_count: number;
  images?: MediaItem[];
  is_liked: number;
}

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  created_at: string;
  image_url: string | null;
  user_name: string;
  avatar?: string;
  replies_count?: number;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  user_id: number;
  comment_id: number;
  from_user_id: number;
  to_user_id: number;
  text: string;
  created_at: string;
  image_url?: string | null;
  user_name: string;
  avatar?: string;
}
