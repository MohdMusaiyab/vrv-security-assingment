import { Request, Response } from "express";
import prisma from "../utils/prisma";
export const createCourseController = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      res
        .status(400)
        .json({ message: "Please enter all fields", success: false });
    }
    const existingCourse = await prisma.course.findFirst({
      where: {
        title,
      },
    });
    if (existingCourse) {
      res
        .status(400)
        .json({ message: "Course already exists", success: false });
    }
    const course = await prisma.course.create({
      data: {
        title,
        description,
      },
    });
    res.json({
      message: "Course created successfully",
      success: true,
      course,
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deleteCourseController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found", success: false });
    }

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    });

    res
      .status(200)
      .json({ message: "Course deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// ===========================================Update Course =====================

export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
    }

    // Admin can update any course
    if (user.role === "ADMIN") {
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
          title,
          description,
        },
      });

      res.status(200).json({
        message: "Course updated successfully",
        success: true,
        data: updatedCourse,
      });
    }

    // Faculty can update only courses they manage
    if (user.role === "FACULTY") {
      // Check if the faculty is assigned to this course
      const facultyCourse = await prisma.facultyCourse.findFirst({
        where: {
          facultyId: userId,
          courseId,
        },
      });

      if (!facultyCourse) {
        res.status(403).json({
          message: "You are not authorized to update this course",
          success: false,
        });
      }

      // Update the course
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
          title,
          description,
        },
      });

      res.status(200).json({
        message: "Course updated successfully",
        success: true,
        data: updatedCourse,
      });
    }

    // If the role is not allowed to update courses
    res.status(403).json({
      message: "You are not authorized to update courses",
      success: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const assignCourseController = async (req: Request, res: Response) => {
  try {
    const { facultyId, courseId } = req.body;
    if (!facultyId || !courseId) {
      res.status(400).json({
        message: "Faculty ID and Course ID are required",
        success: false,
      });
    }
    const faculty = await prisma.user.findUnique({
      where: { id: facultyId },
      select: { role: true },
    });

    if (!faculty || faculty.role !== "FACULTY") {
      res.status(404).json({
        message: "Faculty not found or not authorized",
        success: false,
      });
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found", success: false });
    }
    const existingAssignment = await prisma.facultyCourse.findFirst({
      where: {
        facultyId,
        courseId,
      },
    });

    if (existingAssignment) {
      res.status(400).json({
        message: "Course already assigned to this faculty",
        success: false,
      });
    }

    await prisma.facultyCourse.create({
      data: {
        facultyId,
        courseId,
      },
    });
    res.status(200).json({
      message: "Course assigned to faculty successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const unassignCourseFromFacultyController = async (
  req: Request,
  res: Response
) => {
  try {
    const { facultyId, courseId } = req.body;

    if (!facultyId || !courseId) {
      res.status(400).json({
        message: "Faculty ID and Course ID are required",
        success: false,
      });
      return;
    }

    const assignment = await prisma.facultyCourse.findFirst({
      where: {
        facultyId,
        courseId,
      },
    });

    if (!assignment) {
      res.status(404).json({ message: "Assignment not found", success: false });
      return;
    }

    await prisma.facultyCourse.delete({
      where: {
        id: assignment.id,
      },
    });

    res.status(200).json({
      message: "Course unassigned from faculty successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

export const promoteToFacultyController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    // Check if the user is already a faculty
    if (user.role === "FACULTY") {
      res.status(400).json({
        message: "User is already a faculty member",
        success: false,
      });
      return;
    }

    // Promote to faculty
    await prisma.user.update({
      where: { id: userId },
      data: { role: "FACULTY" },
    });

    res.status(200).json({
      message: "User promoted to faculty successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};

export const demoteFromFacultyController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    // Check if the user is already not a faculty
    if (user.role !== "FACULTY") {
      res.status(400).json({
        message: "User is not a faculty member",
        success: false,
      });
      return;
    }

    // Demote from faculty (default to student role)
    await prisma.user.update({
      where: { id: userId },
      data: { role: "STUDENT" },
    });

    res.status(200).json({
      message: "User demoted from faculty successfully",
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
    return;
  }
};
