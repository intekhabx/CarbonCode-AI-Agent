import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { IAccessTokenPayload, IRefreshTokenPayload } from "../types/auth.type.js";



export const generateAccessToken = (payload: IAccessTokenPayload)=>{
  const accessTokenExpiry = Number(env.JWT_ACCESS_EXPIRES_IN);

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: accessTokenExpiry ?? 900 as SignOptions["expiresIn"]
  })
}

export const verifyAccessToken = (token: string)=>{
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}



export const generateRefreshToken = (payload: IRefreshTokenPayload)=>{
  const refreshTokenExpiry = Number(env.JWT_REFRESH_EXPIRES_IN);

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: refreshTokenExpiry ?? 604800  as SignOptions["expiresIn"]
  })
}

export const verifyRefreshToken = (token: string)=>{
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
