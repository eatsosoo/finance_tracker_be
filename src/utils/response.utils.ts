import type { StatusCode } from "hono/utils/http-status";

export const successResponse = (c: any, message: string, data?: any, status: StatusCode = 200) => {
  return c.json({
    success: true,
    message,
    data: data ?? null,
    error: null
  }, status);
};

export const errorResponse = (c: any, message: string, code?: string, details?: any, status: StatusCode = 400) => {
  return c.json({
    success: false,
    message,
    data: null,
    error: {
      code: code ?? "UNKNOWN_ERROR",
      details: details ?? null
    }
  }, status);
};
