import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("❌ Please provide a module name, e.g. `bun run create-module users`");
  process.exit(1);
}
const upperModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

const basePath = join("src/modules", moduleName);
if (existsSync(basePath)) {
  console.error(`⚠️ Module '${moduleName}' already exists.`);
  process.exit(1);
}

mkdirSync(basePath, { recursive: true });

// --- templates ---
const routeTemplate = `
import { Hono } from "hono";
import { search, create, update, delete, detail } from "@/modules/${moduleName}/${moduleName}.controller";

const router = new Hono();

router.get("/${moduleName}/", search);
router.get("/${moduleName}/:id", detail);
router.post("/${moduleName}", create);
router.put("/${moduleName}", update);
router.delete("/${moduleName}/:id", delete);

export default router;
`.trim();

const controllerTemplate = `
import { ${moduleName}Service } from "@/modules/${moduleName}/${moduleName}.service";
import type { Context } from "hono";
import { HTTP_STATUS } from "@/constants/httpStatus";
import { errorResponse, successResponse } from "@/utils/response.utils";

export const create = async (c: Context) => {
  try {
    // TODO
  } catch (error: any) {
    return errorResponse(
      c,
      "Error creating ${moduleName}",
      "SERVER_ERROR",
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const update = async (c: Context) => {
  try {
    // TODO
  } catch (error: any) {
    return errorResponse(
      c,
      "Error updating ${moduleName}",
      "SERVER_ERROR",
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const detail = async (c: Context) => {
  try {
    // TODO
  } catch (error: any) {
    return errorResponse(
      c,
      "Error fetching detail ${moduleName}",
      "SERVER_ERROR",
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const delete = async (c: Context) => {
  try {
    // TODO
  } catch (error: any) {
    return errorResponse(
      c,
      "Error deleting ${moduleName}",
      "SERVER_ERROR",
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const search = async (c: Context) => {
  try {
    // TODO
  } catch (error: any) {
    return errorResponse(
      c,
      "Error deleting ${moduleName}",
      "SERVER_ERROR",
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
`.trim();

const serviceTemplate = `
import prisma from "@/lib/prisma";
import { BaseService } from "@/core/base.service";

type ${upperModuleName} = {
  // properties
};

class ${upperModuleName}Service extends BaseService<User> {
  constructor() {
    super(prisma.user);
  }

  // TODO: custom methods
}

export const ${moduleName}Service = new ${moduleName}Service();
`.trim();

// --- write files ---
writeFileSync(join(basePath, `${moduleName}.route.ts`), routeTemplate);
writeFileSync(join(basePath, `${moduleName}.controller.ts`), controllerTemplate);
writeFileSync(join(basePath, `${moduleName}.service.ts`), serviceTemplate);

console.log(`✅ Module '${moduleName}' created successfully!`);
