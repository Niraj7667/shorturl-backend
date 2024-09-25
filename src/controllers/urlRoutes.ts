import { Request, Response } from 'express';
import { nanoid } from "nanoid";

import prisma from "prisma/prismaClient";


export const shorten = async (req: Request, res: Response) => {
 
  const longUrl = req.body.originalUrl;

  // Check if original URL is provided
  if (!longUrl) {
    return res.status(400).json({ error: 'Missing original URL' });
  }

  // Generate unique short URL
  const shortUrl = nanoid(6);

  try {
    // Check if a URL with the same long URL already exists (optimized for user)
    const existingUrl = await prisma.url.findFirst({
      where: { longUrl, userId: req.user?.id }, // Check for user's existing URLs
    });

    if (existingUrl) {
      // Return existing short URL if user already shortened it
      return res.status(200).json({
        message: "URL already shortened",
        url: {
          shortUrl: existingUrl.shortUrl, // Keep structure consistent
          longUrl: existingUrl.longUrl,
          userId: req.user?.id,
        }
      });
    }

    // Create a new shortened URL with Prisma
    const result = await prisma.url.create({
      data: {
        longUrl,
        shortUrl,
        userId: req.user?.id, // Associate shortened URL with the authenticated user
      },
    });

    if (result) {
      return res.status(201).json({
        message: "ShortUrl successfully created",
        url: result,
      });
    } else {
      return res.status(501).json({ error: "Couldn't create shortUrl" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal server error" }); // Generic error for client
  }
};
  


export const redirect = async (req: Request, res: Response) => {
  const { shortUrl } = req.params; // Extract shortUrl from URL parameters

  try {
    // Find the URL record in the database by shortUrl
    const urlRecord = await prisma.url.findUnique({
      where: { shortUrl }, // Search for the short URL
    });

    // If no record is found, return a 404 error
    if (!urlRecord) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Ensure the long URL contains a valid protocol (http:// or https://)
    let longUrl = urlRecord.longUrl;
    if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
      longUrl = `http://${longUrl}`; // Default to http:// if no protocol is provided
    }

    // Increment the click count by 1
    await prisma.url.update({
      where: { shortUrl }, // Identify the record to update
      data: {
        clickCount: {
          increment: 1, // Increment the click count
        },
      },
    });

    // Redirect to the long URL
    return res.redirect(longUrl); // Redirect to the absolute long URL
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal server error" }); // Generic error for client
  }
};
