import crypto from "node:crypto";
import db from "../../db/db.js";
import asyncHandler from "../../middleware/async-handler.js";
import type { Request, Response } from "express";
import { usersTable } from "./auth.schema.js";
import { eq } from "drizzle-orm";
import ApiError from "../../lib/api-error.js";
import ApiResponse from "../../lib/api-response.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt.js";
import type {
  AuthRequest,
  IRefreshTokenPayload,
} from "../../types/auth.type.js";
import { cookieOption } from "../../constant/cookie.constant.js";

const generateHashPassword = (password: string, salt: string) => {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
};

const generateHash = (payload: string) => {
  return crypto.createHash("sha256").update(payload).digest("hex");
};

export const signupUserWithEmailAndPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // step:1 extract the data payload from body
    const { name, email, password } = req.body;

    // step:2 check db that user with this email already exists or not
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    // step:3 - genereate salt for the password
    const salt = crypto.createHash("sha256").digest("hex");
    const hash = generateHashPassword(password, salt);

    // step:4 create a new user in the db
    await db.insert(usersTable).values({
      name,
      email,
      password: hash,
      salt,
    });

    ApiResponse.created(res, "User Account Created Successfully");
  },
);

export const signinUserWithEmailAndPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // step:1 extract the data payload from body
    const { email, password } = req.body;

    // step:2 check db that user with this email exists or not
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!user) {
      throw ApiError.unauthorized("invalid email or password");
    }

    // step:3 hash the passwrod to compare with stored password
    const hash = generateHashPassword(password, user.salt!);
    if (user.password !== hash) {
      throw ApiError.unauthorized("invalid email or password");
    }

    // step:4 genereate accesstoken and refreshtoken
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ sub: user.id });

    // step:5 make hash of refreshtoken and store in db
    const hashedRefreshToken = generateHash(refreshToken);

    await db
      .update(usersTable)
      .set({
        refreshToken: hashedRefreshToken,
      })
      .where(eq(usersTable.id, user.id));

    // step:6 add refreshtoken in cookie and send accesstoken as response
    res.cookie("token", refreshToken, cookieOption);

    const userObj = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    ApiResponse.ok(res, "User LoggedIn Successfully", {
      user: userObj,
      accessToken,
    });
  },
);

export const renewAccessTokenAndRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    // step:1 extract refresh token from cookie
    const { token } = req.cookies;
    if (!token) {
      throw ApiError.unauthorized("invalid or missing refresh token");
    }

    // step:2 verify the refresh token
    const decoded = verifyRefreshToken(token) as IRefreshTokenPayload;

    // step:3 find user in db with id
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, decoded.sub));
    if (!user) {
      throw ApiError.unauthorized("invalid refresh token");
    }

    // step:4 verify the hashed refresh token with stored token
    const hashedToken = generateHash(token);
    if (hashedToken !== user.refreshToken) {
      throw ApiError.unauthorized("invalid refresh token");
    }

    // step:5 generate a new accesstoken and refreshtoken
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ sub: user.id });

    // step:6 make hash of new refreshtoken and store in db
    const hashedRefreshToken = generateHash(refreshToken);

    await db
      .update(usersTable)
      .set({
        refreshToken: hashedRefreshToken,
      })
      .where(eq(usersTable.id, user.id));

    // step:7 add new refreshtoken in cookie and send new accesstoken as response
    res.cookie("token", refreshToken, cookieOption);

    ApiResponse.ok(res, "Token renewed successfully", { accessToken });
  },
);

export const signoutUser = asyncHandler(async (req: Request, res: Response) => {
  // step:1 extract refreshtoken from cookie
  const refreshToken = req.cookies?.token;
  if (!refreshToken) {
    throw ApiError.unauthorized("invalid or missing refresh token");
  }

  // step:2 verify the refresh token
  const decoded = verifyRefreshToken(refreshToken) as IRefreshTokenPayload;

  // step:3 find user in db with decoded id
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, decoded.sub));
  if (!user) {
    throw ApiError.unauthorized("invalid refresh token");
  }

  // step:4 verify the hashed refresh token with stored refresh token
  const hashedToken = generateHash(refreshToken);
  if (hashedToken !== user.refreshToken) {
    throw ApiError.unauthorized("invalid refresh token");
  }

  // step:5 remove refreshtoken from db
  await db
    .update(usersTable)
    .set({
      refreshToken: null,
    })
    .where(eq(usersTable.id, user.id));

  // step:6 clear the refreshtoken from cookie
  res.clearCookie("token", cookieOption);

  ApiResponse.ok(res, "User LoggedOut Successfully");
});

export const getLoggedInUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // step:1 extract userId from user object
    const userId = req.user?.sub!;

    // step:2 find the user in the db using userId
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    if (!user) {
      throw ApiError.unauthorized("invalid token");
    }

    // step:3 send only non-critical details to client
    const userObj = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    ApiResponse.ok(res, "User Profile fetch Successfully", { user: userObj });
  },
);
