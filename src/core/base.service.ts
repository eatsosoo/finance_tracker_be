import prisma from "@/lib/prisma";

export class BaseService<T> {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findAll(options: any = {}) {
    return this.model.findMany(options);
  }

  async findById(id: string) {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: T) {
    return this.model.create({ data });
  }

  async update(id: string, data: Partial<T>) {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.model.delete({ where: { id } });
  }

  async getAll({ search, page, perPage, sortField, sortOrder, searchFields }: {
    search?: string;
    page: number;
    perPage: number;
    sortField: string;
    sortOrder: "asc" | "desc";
    searchFields: string[];
  }) {
    const skip = (page - 1) * perPage;

    const where = search && searchFields.length > 0
      ? {
          OR: searchFields.map((field) => ({
            [field]: { contains: search, mode: "insensitive"},
          })),
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }
}
