import { pgTable, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteStatsTable = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  visitorCount: integer("visitor_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
});

export const insertSiteStatsSchema = createInsertSchema(siteStatsTable).omit({ id: true });
export type InsertSiteStats = z.infer<typeof insertSiteStatsSchema>;
export type SiteStats = typeof siteStatsTable.$inferSelect;
