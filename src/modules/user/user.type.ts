export interface UserType {
  id?: number;
  fullname: string;
  password: string;
  email: string;
  phone?: string | null;
  role?: "user" | "admin";
  registerMethod?: "form" | "googleAuth";
  refreshToken?: string | null;
  bonusPoints?:number;
  image?:string | null;
  resetPasswordToken?:string | null;
  resetPasswordExpires?:Date | null;
}