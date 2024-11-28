import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isSignIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken; // Access token from cookies
    if (!token) {
      res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Attach user ID to the request object
    console.log(decoded);
    req.userId = decoded.id;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    // Handle specific JWT errors if needed
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token", success: false });
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired", success: false });
    }

    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export default isSignIn;
