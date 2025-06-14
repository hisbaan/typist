import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import relations from "./relations";
import { config } from "@/config";

export const db = drizzle(config.DATABASE_URL, { schema, relations });

export const tables = schema;
