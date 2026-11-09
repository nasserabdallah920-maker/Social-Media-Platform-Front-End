export interface Notification {
  actor_id: number;
  avatar: string | null;
  comment_id: number | null;
  created_at: string;
  id: number;
  is_read: 0 | 1;
  post_id: number | null;
  text: string | null;
  type: "follow_request"|'follow'|'like'|'comment'|'reply'|'follow_accept',
  user_id: number;
  user_name: string;
}
export interface UserRequests{
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}