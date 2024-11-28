import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
export const isAdminOrFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Getting the userId from the request object
  const userId = req.userId;

  //Checking if the user is a faculty or admin
  const isFaculty = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (isFaculty?.role !== "FACULTY" && isFaculty.role !== "ADMIN") {
    res.status(403).json({ message: "Unauthorized", success: false });
  }

  next();
};
