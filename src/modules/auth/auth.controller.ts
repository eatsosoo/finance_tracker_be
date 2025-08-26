import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Context } from "hono";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const login = async (c: Context) => {
    const { email, password } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return c.json({ error: "Invalid credentials" }, 401);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    await prisma.session.create({
        data: {
            userId: user.id,
            token
        }
    })

    return c.json({ token });
}

export const logout = async (c: Context) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ error: "No token" }, 401);

    const token = authHeader.split(" ")[1];

    await prisma.session.deleteMany({ where: { token }});

    return c.json({ message: "Logged out successfully" });
}
