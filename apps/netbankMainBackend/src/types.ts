import { JwtPayload } from "jsonwebtoken";

export interface UserIdPayload extends JwtPayload {
  userId: string;
}