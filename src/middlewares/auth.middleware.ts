import { HTTP_STATUS } from "@/constants/httpStatus";
import prisma from "@/lib/prisma";
import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ success: false, message: "Missing or invalid token" }, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return c.json({ success: false, message: "Missing token" }, HTTP_STATUS.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    const session = await prisma.session.findUnique({ where: { token } });
    if (!session || session.revoked || session.expiresAt < new Date()) {
      return c.json({ success: false, message: "Token expired or revoked" }, HTTP_STATUS.UNAUTHORIZED);
    }

    // Gắn user đã xác thực vào context
    c.set("user", decoded);

    await next();
  } catch (error) {
    console.error("Auth error:", error);
    return c.json({ success: false, message: "Unauthorized" }, HTTP_STATUS.UNAUTHORIZED);
  }
};
