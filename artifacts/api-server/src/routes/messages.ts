import { Router, type IRouter } from "express";
import { db, messagesTable } from "@workspace/db";
import { CreateMessageBody } from "@workspace/api-zod";
import { sendMessageNotification } from "../lib/mailer";

const router: IRouter = Router();

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, content } = parsed.data;

  const [message] = await db
    .insert(messagesTable)
    .values({ name, content })
    .returning();

  sendMessageNotification(name, content).catch(() => {});

  res.status(201).json({
    id: message.id,
    name: message.name,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  });
});

export default router;
