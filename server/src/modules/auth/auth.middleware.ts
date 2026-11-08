import type { Response, NextFunction } from "express";
import ApiError from "../../lib/api-error.js";
import { verifyAccessToken } from "../../lib/jwt.js";
import db from "../../db/db.js";
import { usersTable } from "./auth.schema.js";
import { eq } from "drizzle-orm";
import type {
  AuthRequest,
  IAccessTokenPayload,
} from "../../types/auth.type.js";
import { ERROR_CODES } from "../../constant/error-code.constant.js";

export const isLoggedIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // step:1 extract accesstoken from the headers
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      throw ApiError.unauthorized("Access Denied, No Token Provided");
    }

    // step:2 extract the actual token from authHeader
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw ApiError.unauthorized("Access Denied, Invalid Token Provided");
    }

    // step:3 verify the token and find user with decoded id
    const decoded = verifyAccessToken(token) as IAccessTokenPayload;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, decoded.sub));
    if (!user) {
      throw ApiError.unauthorized("Access Denied, Token Expired", ERROR_CODES.TOKEN_EXPIRED);
    }

    // step:4 add user object in the req object
    req.user = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } 
  catch (error) {
    console.log(error);
    next(error);
  }
}
