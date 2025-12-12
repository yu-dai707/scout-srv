/*
  Warnings:

  - You are about to drop the column `languages` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `Scout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredLanguage` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredSkills` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Scout" DROP CONSTRAINT "Scout_jobId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "languages",
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "language",
ADD COLUMN     "requiredLanguage" TEXT NOT NULL,
ADD COLUMN     "requiredSkills" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Scout" DROP COLUMN "jobId";

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
