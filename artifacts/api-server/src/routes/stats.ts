import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteStatsTable } from "@workspace/db";
import { GetStatsResponse, RecordVisitResponse, AddLikeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateStats() {
  const rows = await db.select().from(siteStatsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [row] = await db.insert(siteStatsTable).values({ visitorCount: 0, likeCount: 0 }).returning();
  return row;
}

router.get("/stats", async (_req, res): Promise<void> => {
  const stats = await getOrCreateStats();
  res.json(GetStatsResponse.parse({ visitorCount: stats.visitorCount, likeCount: stats.likeCount }));
});

router.post("/visitors", async (_req, res): Promise<void> => {
  const stats = await getOrCreateStats();
  const [updated] = await db
    .update(siteStatsTable)
    .set({ visitorCount: (stats.visitorCount ?? 0) + 1 })
    .where(eq(siteStatsTable.id, stats.id))
    .returning();
  res.json(RecordVisitResponse.parse({ visitorCount: updated.visitorCount, likeCount: updated.likeCount }));
});

router.post("/likes", async (_req, res): Promise<void> => {
  const stats = await getOrCreateStats();
  const [updated] = await db
    .update(siteStatsTable)
    .set({ likeCount: (stats.likeCount ?? 0) + 1 })
    .where(eq(siteStatsTable.id, stats.id))
    .returning();
  res.json(AddLikeResponse.parse({ visitorCount: updated.visitorCount, likeCount: updated.likeCount }));
});

export default router;
