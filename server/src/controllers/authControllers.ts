import { Request, Response, RequestHandler } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import {
  comparePassword,
  generateRefreshToken,
  generateToken,
  hashPassword,
} from "../utils/auth";

export const registerController:RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, name, uniRollNo } = await req.body;
    if (!email || !password || !name || !uniRollNo) {
      res
        .status(400)
        .send({ message: "Please fill all the fields", sucess: false });
        return;
    }
    
    //Now we will check if the user already exists using email or uniRollNo
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { uniRollNo }],
      },
    });
    if (user) {
      res.status(400).send({ message: "User already exists", success: false });
    }

    //Now we will create a new user in the database
    //First we will hash the password then we will create the user
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        uniRollNo,
      },
    });
    res.status(201).send({ message: "User created", success: true });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

// =============================================Login Controller=============================================

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
        return;
    }
    //Now we will check if the user exists or not
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({ message: "User does not exist", success: false });
    }
    //Now we will compare the password
    const isMatch = await comparePassword(password, user?.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials", success: false });
    }
    //Now we will be genetaing the tokens ,access token and refresh token

    const accessToken = generateToken(user?.id as string);

    const refreshToken = generateRefreshToken(user?.id as string);

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents JS access to the cookie (security)
      secure: process.env.NODE_ENV === "production", // Ensures cookie is only sent over HTTPS
      maxAge: 3600000, // Set expiry time for access token cookie (1 hour)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800000, // Set expiry time for refresh token cookie (7 days)
    });
    res.status(200).json({
      message: "Login Successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// ========================================Refresh Token===================================

export const refreshController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(400)
      .json({ message: "Refresh token is required", success: false });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

  // @ts-ignore
  const newAccessToken = generateToken(decoded.id as string);

  res.status(200).json({ accessToken: newAccessToken, success: true });
};
