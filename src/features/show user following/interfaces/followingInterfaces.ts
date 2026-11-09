export interface FollowingUser {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface FollowingPage {
  data: FollowingUser[];
  nextPage: number | null;
}
