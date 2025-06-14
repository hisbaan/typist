import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  serial,
  integer,
  check,
  pgView,
} from "drizzle-orm/pg-core";
import { withTimestamps } from "./utils";

export const users = pgTable(
  "users",
  withTimestamps({
    id: serial("id").primaryKey(),
    workosId: text("workos_id").notNull().unique(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
  }),
);

export const friendships = pgTable(
  "friendships",
  withTimestamps({
    firstUserId: integer("first_user_id")
      .notNull()
      .references(() => users.id),
    secondUserId: integer("second_user_id")
      .notNull()
      .references(() => users.id),
  }),
  (table) => [
    check(
      "first_id_less_than_second_id",
      sql`${table.firstUserId} < ${table.secondUserId}`,
    ),
  ],
);

export const userFriends = pgView("user_friends").as((qb) => {
  const forwardDirection = qb
    .select({
      userId: friendships.firstUserId,
      friendId: friendships.secondUserId,
    })
    .from(friendships);
  const backwardsDirection = qb
    .select({
      userId: friendships.secondUserId,
      friendId: friendships.firstUserId,
    })
    .from(friendships);

  return forwardDirection.unionAll(backwardsDirection);
});

export const keepAlive = pgTable(
  "keep_alive",
  withTimestamps({
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    random: text("random")
      .notNull()
      .default(sql`gen_random_uuid()`),
  }),
);
