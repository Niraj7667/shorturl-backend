import { Request, Response } from 'express';
import prisma from 'prisma/prismaClient';

// Fetch all URLs for authenticated user
export const getUserUrls = async (req: Request, res: Response) => {
    try {
      const urls = await prisma.url.findMany({
        where: { userId: req.user?.id },
      });
     return res.status(200).json({ urls });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch URLs' });
    }
  };
  