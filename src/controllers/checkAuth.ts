import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from 'prisma/prismaClient'; // Assuming prisma is set up

// Middleware for checking the JWT and authenticating the user
export const checkAuth = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '

  console.log("Received token:", token); // Log the token received from frontend

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Fetch the user using the decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid user' });
    }

    // Send success response if the user is authenticated
    return res.status(200).json({ message: 'Authenticated', user });
  } catch (error) {
    console.error('Token verification error:', error); // Log any errors during token verification
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
