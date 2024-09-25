import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
export const deleteUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUrl = await prisma.url.delete({
            where: { id },
        });
        res.status(200).json({ message: 'URL deleted successfully', deletedUrl });
    }
    catch (err) {
        console.error('Error deleting URL:', err);
        res.status(404).json({ message: 'URL not found or internal server error' });
    }
};
export default router;
