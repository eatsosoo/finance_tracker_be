import type { Context } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { HTTP_STATUS } from "@/constants/httpStatus";
import { errorResponse, successResponse } from "@/utils/response.utils";
import { MESSAGES } from "@/constants/messages";
import { userService } from "./user.service";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Create a new user
export const create = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { email, password, username } = body;

        // 1️⃣ Validate input
        if (!email || !password) {
            return errorResponse(
                c,
                MESSAGES.AUTH.INVALID_CREDENTIALS,
                "MISSING_FIELDS",
                null,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // 2️⃣ Check existing user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return errorResponse(
                c,
                MESSAGES.USER.EXISTS,
                "MISSING_FIELDS",
                null,
                HTTP_STATUS.CONFLICT
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Create user
        const user = await userService.create({
            email,
            password: hashedPassword,
            name: username || email.split("@")[0],
        });

        // 5️⃣ Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        // 6️⃣ Return response
        return successResponse(
            c,
            MESSAGES.USER.CREATED,
            { user, token },
            HTTP_STATUS.CREATED
        );
    } catch (error: any) {
        return errorResponse(
            c,
            "Error creating user",
            "SERVER_ERROR",
            error.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

// Update a user
export const update = async (c: Context) => {
    try {
        const userId = c.req.param("id"); // Lấy id từ URL /users/:id
        const body = await c.req.json();

        // Kiểm tra user tồn tại
        const existingUser = await userService.findById(userId);

        if (!existingUser) {
            return errorResponse(
                c,
                MESSAGES.USER.NOT_FOUND,
                "USER_NOT_FOUND",
                null,
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Cập nhật thông tin
        const updatedUser = await userService.update(userId, body);

        return successResponse(
            c,
            MESSAGES.USER.UPDATED,
            updatedUser,
            HTTP_STATUS.OK
        );
    } catch (error: any) {
        return errorResponse(
            c,
            "Error updating user",
            "SERVER_ERROR",
            error.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

// Delete a user by ID
export const remove = async (c: Context) => {
    try {
        const userId = c.req.param("id");
        // Kiểm tra user tồn tại
        const existingUser = await userService.findById(userId);

        if (!existingUser) {
            return errorResponse(
                c,
                MESSAGES.USER.NOT_FOUND,
                "USER_NOT_FOUND",
                null,
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Delete user
        await userService.delete(userId);

        return successResponse(c, MESSAGES.USER.DELETED, null, HTTP_STATUS.OK);
    } catch (error: any) {
        return errorResponse(
            c,
            "Error deleting user",
            "SERVER_ERROR",
            error.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

// Get detail user by ID
export const detail = async (c: Context) => {
    try {
        const userId = c.req.param("id");
        // Kiểm tra user tồn tại
        const existingUser = await userService.findById(userId);

        if (!existingUser) {
            return errorResponse(
                c,
                MESSAGES.USER.NOT_FOUND,
                "USER_NOT_FOUND",
                null,
                HTTP_STATUS.NOT_FOUND
            );
        }

        return successResponse(
            c,
            MESSAGES.USER.DETAIL,
            existingUser,
            HTTP_STATUS.OK
        );
    } catch (error: any) {
        return errorResponse(
            c,
            "Error deleting user",
            "SERVER_ERROR",
            error.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

// Search users by email, username and sort
export const search = async (c: Context) => {
    try {
        // Lấy query params
        const perPage = parseInt(c.req.query("per_page") || "10");
        const page = parseInt(c.req.query("page") || "1");
        const sortField = c.req.query("field") || "created_at";
        const sortOrder = (c.req.query("sort") || "desc") as "asc" | "desc";
        const keyword = c.req.query("keyword") || "";

        // Tính offset
        const skip = (page - 1) * perPage;

        // Tạo điều kiện tìm kiếm (có thể mở rộng)
        const whereCondition = keyword
            ? {
                OR: [
                    { name: { contains: keyword } },
                    { email: { contains: keyword } },
                ],
            }
            : {};

        // Truy vấn dữ liệu
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: whereCondition,
                skip, // Phân trang offset
                take: perPage, // Phân trang limit
                orderBy: {
                    [sortField]: sortOrder,
                },
            }),
            prisma.user.count({ where: whereCondition }),
        ]);

        // Tổng số trang
        const totalPages = Math.ceil(total / perPage);

        // Kết quả trả về
        return successResponse(
            c,
            MESSAGES.USER.LISTED,
            {
                meta: {
                    total,
                    totalPages,
                    perPage,
                    currentPage: page,
                },
                users,
            },
            HTTP_STATUS.OK
        );
    } catch (error: any) {
        return errorResponse(
            c,
            "Error searching user",
            "SERVER_ERROR",
            error.message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};
