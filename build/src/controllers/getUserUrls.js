import prisma from 'prisma/prismaClient';
export const getUserUrls = async (req, res) => {
    try {
        const urls = await prisma.url.findMany({
            where: { userId: req.user?.id },
        });
        return res.status(200).json({ urls });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
};
