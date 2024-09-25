// Import necessary modules
import express from 'express';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const router = express.Router();
const prisma = new PrismaClient(); // Initialize Prisma Client

// DELETE /api/urls/:id - Delete a URL by ID
export const deleteUrl =  async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUrl = await prisma.url.delete({
      where: { id }, // Assuming 'id' is a unique identifier
    });

    res.status(200).json({ message: 'URL deleted successfully', deletedUrl });
  } catch (err) {
    console.error('Error deleting URL:', err);
    res.status(404).json({ message: 'URL not found or internal server error' });
  }
};

// Export the router
export default router;
