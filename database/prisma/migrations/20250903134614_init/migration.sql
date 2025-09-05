-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('client', 'owner', 'manager', 'supervisor', 'assistant');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."PropertyStatus" AS ENUM ('pending', 'approved', 'rejected', 'sold', 'rented');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."LeaseDraftStatus" AS ENUM ('draft', 'client_review', 'manager_review', 'approved', 'signed');

-- CreateEnum
CREATE TYPE "public"."NegotiationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'countered');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "branchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffApplication" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'pending',
    "tempPassword" TEXT,
    "branchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(15,2) NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" DECIMAL(4,1) NOT NULL,
    "sqft" DECIMAL(10,2) NOT NULL,
    "yearBuilt" INTEGER,
    "status" "public"."PropertyStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agentId" INTEGER,
    "branchId" INTEGER,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyPhoto" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ViewRequest" (
    "id" SERIAL NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'pending',
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "assistantId" INTEGER,

    CONSTRAINT "ViewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeaseDraft" (
    "id" SERIAL NOT NULL,
    "currentTerms" JSONB NOT NULL,
    "status" "public"."LeaseDraftStatus" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "propertyId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "LeaseDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Negotiation" (
    "id" SERIAL NOT NULL,
    "proposedTerms" JSONB NOT NULL,
    "status" "public"."NegotiationStatus" NOT NULL,
    "staffResponse" JSONB,
    "responseMessage" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "draftId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "previousNegotiationId" INTEGER,

    CONSTRAINT "Negotiation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lease" (
    "id" SERIAL NOT NULL,
    "finalTerms" JSONB NOT NULL,
    "signedByClient" BOOLEAN NOT NULL DEFAULT false,
    "signedByAgent" BOOLEAN NOT NULL DEFAULT false,
    "activeFrom" DATE NOT NULL,
    "draftId" INTEGER NOT NULL,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StaffApplication_email_key" ON "public"."StaffApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LeaseDraft_propertyId_key" ON "public"."LeaseDraft"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Negotiation_previousNegotiationId_key" ON "public"."Negotiation"("previousNegotiationId");

-- CreateIndex
CREATE UNIQUE INDEX "Lease_draftId_key" ON "public"."Lease"("draftId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffApplication" ADD CONSTRAINT "StaffApplication_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyPhoto" ADD CONSTRAINT "PropertyPhoto_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ViewRequest" ADD CONSTRAINT "ViewRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ViewRequest" ADD CONSTRAINT "ViewRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ViewRequest" ADD CONSTRAINT "ViewRequest_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaseDraft" ADD CONSTRAINT "LeaseDraft_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaseDraft" ADD CONSTRAINT "LeaseDraft_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Negotiation" ADD CONSTRAINT "Negotiation_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "public"."LeaseDraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Negotiation" ADD CONSTRAINT "Negotiation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Negotiation" ADD CONSTRAINT "Negotiation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Negotiation" ADD CONSTRAINT "Negotiation_previousNegotiationId_fkey" FOREIGN KEY ("previousNegotiationId") REFERENCES "public"."Negotiation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Lease" ADD CONSTRAINT "Lease_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "public"."LeaseDraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
