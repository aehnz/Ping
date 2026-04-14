export type UserStatus = "free" | "dnd";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  custom_message: string;
  partner_id: string | null;
  partner_code: string;
  updated_at: string;
}
