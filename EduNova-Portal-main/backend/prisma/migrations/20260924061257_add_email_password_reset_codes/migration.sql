-- CreateTable
CREATE TABLE "password_reset_codes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "password_reset_codes_email_consumed_idx" ON "password_reset_codes"("email", "consumed");

-- CreateIndex
CREATE INDEX "password_reset_codes_expiresAt_idx" ON "password_reset_codes"("expiresAt");
