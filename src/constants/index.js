import path from "node:path";
export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};
export const ACCESS_TOKEN_LIVE = 15 * 60 * 1000;
export const REFRESH_TOKEN_LIVE = 24 * 30 * 60 * 60 * 1000;
export const TEMPLATES_DIR = path.join(process.cwd(), "src", "templates");
