/*
  Warnings:

  - You are about to drop the column `experience` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Candidate` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('UNCONFIRMED', 'DOCUMENT', 'FIRST', 'SECOND', 'APTITUDE', 'FINAL', 'OFFER', 'REJECT', 'PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "experience",
DROP COLUMN "language",
ADD COLUMN     "currentJobType" TEXT,
ADD COLUMN     "introVideoUrl" TEXT,
ADD COLUMN     "japaneseLevel" TEXT,
ADD COLUMN     "registeredOrg" TEXT,
ADD COLUMN     "selfPr" TEXT,
ADD COLUMN     "skillTest" TEXT,
ADD COLUMN     "unionName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "nationality" DROP NOT NULL,
ALTER COLUMN "visaStatus" DROP NOT NULL,
ALTER COLUMN "skills" DROP NOT NULL;
