export interface BlockedUser {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface BlockedPage {
  success: string;
  data: BlockedUser[];
  nextPage: number | null;
}
