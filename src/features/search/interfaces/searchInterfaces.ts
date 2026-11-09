import { Post } from "@/features/feed/interfaces/postInterfaces";

export interface SearchUser {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface SearchPost extends Post {
  first_name?: string;
  last_name?: string;
}

export interface SearchResponse {
  data: {
    users: SearchUser[];
    posts: SearchPost[];
  };
}

