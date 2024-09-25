import { Request, Response } from 'express';
import prisma from 'prisma/prismaClient';

export const updateUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.params; // Extract shortUrl from the URL parameters
  const { newShortUrl } = req.body; // Get new long URL from request body

  // Validate input
  if (!newShortUrl ) {
    return res.status(400).json({ error: 'Invalid or missing new long URL' });
  }

  try {
    // Find the URL record by shortUrl and ensure it belongs to the authenticated user
    const urlRecord = await prisma.url.findFirst({
      where: { shortUrl, userId: req.user?.id }, // Assuming user is authenticated and userId is available
    });

    // If no record is found, return a 404 error
    if (!urlRecord) {
      return res.status(404).json({ error: 'URL not found or you do not have permission to modify it' });
    }

    // Update the long URL for the found record
    const updatedUrl = await prisma.url.update({
      where: { id: urlRecord.id },
      data: { shortUrl: newShortUrl }, // Update with the new short URL
    });

    // Respond with the updated URL details
    return res.status(200).json({
      message: 'URL updated successfully',
      url: {
        shortUrl: updatedUrl.shortUrl,
        longUrl: updatedUrl.longUrl,
      },
    });
  } catch (error) {
    console.error('Error updating URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
