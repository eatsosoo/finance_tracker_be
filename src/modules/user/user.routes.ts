import { Hono } from "hono";
import { createUser, deleteUser, detailUser, searchUsers, updateUser } from "@/modules/user/user.controller";

const user = new Hono();

user.get("/users", searchUsers);
user.get("/users/:id", detailUser);
user.post("/users", createUser);
user.put("/users/:id", updateUser);
user.delete("/users/:id", deleteUser);

export default user;