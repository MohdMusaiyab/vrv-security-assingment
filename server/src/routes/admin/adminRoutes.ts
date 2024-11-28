import express from "express";
import {
  assignCourseController,
  createCourseController,
  deleteCourseController,
  demoteFromFacultyController,
  promoteToFacultyController,
  unassignCourseFromFacultyController,
  updateCourseController,
} from "../../controllers/adminController";
import isSignIn from "../../middlewares/isSignIn";
import { isAdmin } from "../../middlewares/isAdmin";
import { isAdminOrFaculty } from "../../middlewares/isAdminorFaculty";

const adminRoutes = express.Router();

adminRoutes.post("/create-course", isSignIn, isAdmin, createCourseController);

adminRoutes.delete(
  "/delete-course/:courseId",
  isSignIn,
  isAdmin,
  deleteCourseController
);

adminRoutes.put(
  "/update-course/:courseId",
  isSignIn,
  isAdminOrFaculty,
  updateCourseController
);

adminRoutes.post(
  "/assign-course-to-faculty",
  isSignIn,
  isAdmin,
  assignCourseController
);

adminRoutes.delete(
  "/unassign-course-from-faculty",
  isSignIn,
  isAdmin,
  unassignCourseFromFacultyController
);
adminRoutes.put(
  "/promote-to-faculty/:userId",
  isSignIn,
  isAdmin,
  promoteToFacultyController
);

adminRoutes.put(
  "/demote-from-faculty/:userId",
  isSignIn,
  isAdmin,
  demoteFromFacultyController
);

export default adminRoutes;
