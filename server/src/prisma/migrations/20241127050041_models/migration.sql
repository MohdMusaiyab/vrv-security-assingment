/*
  Warnings:

  - A unique constraint covering the columns `[uniRollNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniRollNo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FACULTY', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "uniRollNo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyCourse" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "FacultyCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCourse" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacultyCourse_facultyId_courseId_key" ON "FacultyCourse"("facultyId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCourse_studentId_courseId_key" ON "StudentCourse"("studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniRollNo_key" ON "User"("uniRollNo");

-- AddForeignKey
ALTER TABLE "FacultyCourse" ADD CONSTRAINT "FacultyCourse_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyCourse" ADD CONSTRAINT "FacultyCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
