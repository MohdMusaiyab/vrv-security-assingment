import { Request, Response } from "express";
import prisma from "../utils/prisma";
export const enrollStudentInCourseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found", success: false });
      return;
    }

    // Check if the student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found", success: false });
      return;
    }

    // Ensure the faculty is authorized to enroll students in this course
    const facultyCourse = await prisma.facultyCourse.findFirst({
      where: {
        facultyId: req.userId, // assuming req.userId stores the logged-in faculty ID
        courseId: courseId,
      },
    });

    if (!facultyCourse) {
      res.status(403).json({
        message: "You are not authorized to enroll students in this course",
        success: false,
      });
      return;
    }

    // Enroll the student in the course
    await prisma.studentCourse.create({
      data: {
        studentId,
        courseId,
      },
    });

    res.status(200).json({
      message: "Student enrolled in course successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

export const removeStudentFromCourseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found", success: false });
      return;
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found", success: false });
      return;
    }

    const facultyCourse = await prisma.facultyCourse.findFirst({
      where: {
        facultyId: req.userId,
        courseId: courseId,
      },
    });

    if (!facultyCourse) {
      res.status(403).json({
        message: "You are not authorized to remove students from this course",
        success: false,
      });
      return;
    }
    await prisma.studentCourse.deleteMany({
      where: {
        studentId,
        courseId,
      },
    });

    res.status(200).json({
      message: "Student removed from course successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};
