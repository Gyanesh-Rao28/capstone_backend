/*
  Warnings:

  - You are about to drop the `academic_terms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deliverables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "academic_terms" DROP CONSTRAINT "academic_terms_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_projectId_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_studentId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_applications" DROP CONSTRAINT "project_applications_groupId_fkey";

-- DropForeignKey
ALTER TABLE "project_applications" DROP CONSTRAINT "project_applications_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_applications" DROP CONSTRAINT "project_applications_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_courseId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_termId_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_deliverableId_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_gradedBy_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_groupId_fkey";

-- DropTable
DROP TABLE "academic_terms";

-- DropTable
DROP TABLE "courses";

-- DropTable
DROP TABLE "deliverables";

-- DropTable
DROP TABLE "group_members";

-- DropTable
DROP TABLE "groups";

-- DropTable
DROP TABLE "project_applications";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "submissions";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "CourseType";

-- DropEnum
DROP TYPE "GroupStatus";

-- DropEnum
DROP TYPE "MemberStatus";

-- DropEnum
DROP TYPE "ProjectStatus";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
