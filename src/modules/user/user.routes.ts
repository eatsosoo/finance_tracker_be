import { Hono } from "hono";
import { create, remove, detail, search, update } from "@/modules/user/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const user = new Hono();

// Middleware
user.use("*", authMiddleware);

// End points
user.get("/users", search);
user.get("/users/:id", detail);
user.post("/users", create);
user.put("/users/:id", update);
user.delete("/users/:id", remove);

export default user;