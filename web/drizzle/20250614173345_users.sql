CREATE TABLE "friendships" (
	"first_user_id" integer NOT NULL,
	"second_user_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "first_id_less_than_second_id" CHECK ("friendships"."first_user_id" < "friendships"."second_user_id")
);

CREATE TABLE "keep_alive" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"random" text DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"workos_id" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_workos_id_unique" UNIQUE("workos_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "friendships" ADD CONSTRAINT "friendships_first_user_id_users_id_fk" FOREIGN KEY ("first_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_second_user_id_users_id_fk" FOREIGN KEY ("second_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
CREATE VIEW "public"."user_friends" AS ((select "first_user_id", "second_user_id" from "friendships") union all (select "second_user_id", "first_user_id" from "friendships"));