import express from "express";
import isSignIn from "../../middlewares/isSignIn";
import { isAdminOrFaculty } from "../../middlewares/isAdminorFaculty";
import { enrollStudentInCourseController, removeStudentFromCourseController } from "../../controllers/facultyContrller";

const facultyRoutes = express.Router();

facultyRoutes.post(
  "/enroll-student/:courseId",
  isSignIn,
  isAdminOrFaculty,
  enrollStudentInCourseController
);

facultyRoutes.delete(
    "/remove-student/:courseId",
    isSignIn,
    isAdminOrFaculty,
    removeStudentFromCourseController
  );
  
export default facultyRoutes;
