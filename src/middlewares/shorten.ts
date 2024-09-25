import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from 'prisma/prismaClient'; // Assuming prisma is set up

// Middleware for checking the JWT and authenticating the user
export const shortenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { userId: string };

    // Fetch the user using the decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid user' });
    }

    // Attach user info to the request object
    req.user = user; // Now req.user will be available in updateUrl

    // Pass control to the next middleware
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Log any errors during token verification
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
