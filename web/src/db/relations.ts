import * as schema from "./schema";
import { defineRelations } from "drizzle-orm";

export default defineRelations(schema, (r) => ({
  users: {
    friends: r.many.users({
      from: r.users.id.through(r.userFriends.userId),
      to: r.users.id.through(r.userFriends.friendId),
    }),
  },
}));
