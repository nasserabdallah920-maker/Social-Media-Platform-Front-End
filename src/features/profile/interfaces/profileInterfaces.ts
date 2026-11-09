export interface UserProfile {
  id: number;
  avatar: string | null;
  bio: string | null;
  first_name: string;
  last_name: string;
  user_name: string;
  followers_count: number;
  following_count: number;
  is_following: number;
  is_private: number;
  is_requested: number;
  posts_count:number
}
