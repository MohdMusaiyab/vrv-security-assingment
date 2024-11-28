import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user) {
      if (user.role !== "ADMIN") {
        res.status(401).send({
          message: "You are not authorized to do this action",
          success: false,
        });
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "You are not authorized to access this route",
      success: false,
    });
  }
};
