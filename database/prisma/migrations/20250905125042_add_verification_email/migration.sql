-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" TEXT DEFAULT 'manual',
ALTER COLUMN "role" SET DEFAULT 'client';

-- CreateTable
CREATE TABLE "public"."VerificationEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_email_key" ON "public"."VerificationEmail"("email");
