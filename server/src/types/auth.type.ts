import type { Request } from "express";


export interface IAccessTokenPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
}

export interface IRefreshTokenPayload {
  sub: string;
}


export interface AuthRequest extends Request {
  user?: {
    sub: string;
    email: string;
    role: "user" | "admin";
  };
}