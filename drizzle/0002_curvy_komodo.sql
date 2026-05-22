CREATE TABLE "memberships" (
	"user_id" text PRIMARY KEY NOT NULL,
	"whop_membership_id" text,
	"whop_user_id" text,
	"status" text NOT NULL,
	"plan" text,
	"current_period_end" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;