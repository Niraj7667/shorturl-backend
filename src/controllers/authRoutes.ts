import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import prisma from "prisma/prismaClient";
import * as crypto from 'crypto';



// Function to generate a random salt
function generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }
  
  // Function to hash the password with salt
  function hashPassword(password: string, salt: string): string {
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return hashedPassword;
  }
  

// Sign-up route
export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        // Email already exists, redirect to the login page
        return res.status(409).json({ message: "Already have an account. Please log in." });
      }
  
      // Generate a random salt
      const salt = generateSalt();
  
      // Hash the password with the generated salt
      const hashedPassword = hashPassword(password, salt);
  
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          salt,
        },
      });
  
      // Generate JWT token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });
  
      // Set cookie with the token
       res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
     
      return res.json({
        message: "User signed up successfully",
        user: newUser,
        token,
      });
    } catch (error) {
      // console.log(error);
      return res.json({ error });
    }
  };
  
  // Login route
  export const login = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the user is already signed up
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });
  
      if (!existingUser) {
        // User not found, display an error message
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      }
  
      // Hash the provided password with the stored salt
      const hashedPassword = hashPassword(password, existingUser.salt);
  
      // Check if the password is correct
      if (hashedPassword !== existingUser.password) {
        // Incorrect password, display an error message
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
  

      res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
      return res.json({ message: "Login successful", user: existingUser, token });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  // Logout route
  export const logout = (req: Request, res: Response) => {
    // Clear the JWT cookie on logout
    res.clearCookie("jwt");
    return res.json({ message: "Logout successful" });
  };
 