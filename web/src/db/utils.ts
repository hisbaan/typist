import { timestamp } from "drizzle-orm/pg-core";

export function withTimestamps<T extends Record<string, unknown>>(fields: T) {
  return {
    ...fields,
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  };
}
