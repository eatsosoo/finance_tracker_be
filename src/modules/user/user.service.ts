import prisma from "@/lib/prisma";
import { BaseService } from "@/core/base.service";

type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
};

class UserService extends BaseService<User> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email } });
  }
}

export const userService = new UserService();
