import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from "prisma/prismaClient";

// Middleware to check JWT authentication
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      // Verify JWT token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Check if decoded contains userId
      if (!decoded.userId) {
        return res.status(401).json({ message: 'Unauthorized - Missing userId in token' });
      }

      // Fetch the user using the user ID from the token
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });


      if (!req.user) {
        // User not found, respond with 401 Unauthorized
        return res.status(401).json({ message: 'Unauthorized - Invalid user' });
      }

      // Proceed to next middleware if user is found
      next();

    } catch (error) {
      console.error("Error in authentication middleware:", error); // Log the error
      if (error instanceof jwt.JsonWebTokenError) {
        // Handle JWT errors (e.g., invalid signature, token expiration)
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }
      // For other errors (like database errors), respond with a generic error
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    // No token provided, respond with 401 Unauthorized
    res.status(401).json({ message: "Unauthorized - No token provided" });
  }
};
