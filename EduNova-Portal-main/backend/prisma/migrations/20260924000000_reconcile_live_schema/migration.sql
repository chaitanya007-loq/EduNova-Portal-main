-- Reconcile additive objects observed in the existing PostgreSQL database.
-- This migration is intentionally non-destructive: it does not drop tables or rows.

ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "degree" TEXT;
ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "branch" TEXT;
ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "semester" TEXT;
ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "exam" TEXT;

CREATE TABLE IF NOT EXISTS "notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subjectId" TEXT,
    "topicId" TEXT,
    "courseId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'USER',
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "attachments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "readTimeMin" INTEGER NOT NULL DEFAULT 1,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "notes_userId_idx" ON "notes"("userId");
CREATE INDEX IF NOT EXISTS "notes_userId_isPinned_idx" ON "notes"("userId", "isPinned");
CREATE INDEX IF NOT EXISTS "notes_userId_isFavorite_idx" ON "notes"("userId", "isFavorite");
CREATE INDEX IF NOT EXISTS "notes_userId_type_idx" ON "notes"("userId", "type");
CREATE INDEX IF NOT EXISTS "notes_subjectId_idx" ON "notes"("subjectId");
CREATE INDEX IF NOT EXISTS "notes_topicId_idx" ON "notes"("topicId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_userId_fkey') THEN
    ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_subjectId_fkey') THEN
    ALTER TABLE "notes" ADD CONSTRAINT "notes_subjectId_fkey"
      FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_topicId_fkey') THEN
    ALTER TABLE "notes" ADD CONSTRAINT "notes_topicId_fkey"
      FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
