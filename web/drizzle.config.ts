import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ["public"],
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
  },
  verbose: true,
  strict: true,
  breakpoints: false,
});
