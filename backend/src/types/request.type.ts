import { Request } from "express";
import { User } from "./user.type";

export type AuthUser = Pick<User, 'id' | 'email' | 'role' | 'isVerified'>;

export interface AuthenticatedRequest extends Request {
    user: AuthUser;
}

export interface JWTPayload extends Omit<AuthUser, 'id'> {
    userId: string;
    iat: number;    // issued at timestamp
    exp: number;    // expiration timestamp
}