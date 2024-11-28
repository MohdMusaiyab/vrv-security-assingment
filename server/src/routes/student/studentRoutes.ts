import express from "express";
import prisma from "../../utils/prisma";
import isSignIn from "../../middlewares/isSignIn";

const studentRoutes = express.Router();

studentRoutes.get("/:studentId/courses", isSignIn, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate if the student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found", success: false });
    }

    // Fetch the courses the student is enrolled in
    const courses = await prisma.studentCourse.findMany({
      where: { studentId }, // Find all entries in the StudentCourse table for the given student
      include: {
        course: true, // Include the course details
      },
    });

    // Transform the data into a cleaner format
    const formattedCourses = courses.map((entry) => ({
      id: entry.course.id,
      title: entry.course.title,
      description: entry.course.description,
      enrolledAt: entry.enrolledAt,
    }));

    res
      .status(200)
      .json({
        success: true,
        data: formattedCourses,
        message: "Courses fetched successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

export default studentRoutes;
