import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.saba_admin;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return next(new HttpError(401, "Please sign in to continue."));
  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    return next(new HttpError(401, "Your admin session has expired. Please sign in again."));
  }
  if (typeof payload === "string" || typeof payload.sub !== "string") {
    return next(new HttpError(401, "Your admin session is invalid. Please sign in again."));
  }
  const admin = await db.admin.findUnique({ where: { id: payload.sub }, select: { id: true } });
  if (!admin) return next(new HttpError(401, "This admin account is no longer available."));
  next();
}

export function asyncRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
