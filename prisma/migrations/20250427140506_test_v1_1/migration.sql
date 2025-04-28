/*
  Warnings:

  - You are about to drop the column `email` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Faculty_email_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "email",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email",
DROP COLUMN "name";
