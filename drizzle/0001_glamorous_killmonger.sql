CREATE TABLE "scan_candidates" (
	"scan_id" uuid NOT NULL,
	"symbol" text NOT NULL,
	"state" text NOT NULL,
	"watch" text,
	"location" text,
	"score" numeric,
	"last_price" numeric,
	"ma_distance_atr" numeric,
	"ma_distance_pct" numeric,
	"gap_atr" numeric,
	"avg_dollar_volume" numeric,
	"prior45_position" text,
	"prior45_action" text,
	"data" jsonb NOT NULL,
	CONSTRAINT "scan_candidates_scan_id_symbol_pk" PRIMARY KEY("scan_id","symbol")
);
--> statement-breakpoint
CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"scanner_name" text NOT NULL,
	"feed" text,
	"bar_seconds" integer,
	"universe_size" integer,
	"candidate_count" integer NOT NULL,
	"settings" jsonb,
	"raw" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scans_generated_at_unique" UNIQUE("generated_at")
);
--> statement-breakpoint
ALTER TABLE "scan_candidates" ADD CONSTRAINT "scan_candidates_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE cascade ON UPDATE no action;