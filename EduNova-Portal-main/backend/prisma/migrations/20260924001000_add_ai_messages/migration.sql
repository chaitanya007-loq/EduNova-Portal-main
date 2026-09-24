CREATE TABLE IF NOT EXISTS "ai_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT DEFAULT 'Sage Tutoring Session',
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ai_conversations_userId_createdAt_idx"
  ON "ai_conversations"("userId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_conversations_userId_fkey') THEN
    ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ai_messages_conversationId_createdAt_idx"
  ON "ai_messages"("conversationId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_messages_conversationId_fkey') THEN
    ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey"
      FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;