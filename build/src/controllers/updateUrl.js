import prisma from 'prisma/prismaClient';
export const updateUrl = async (req, res) => {
    const { shortUrl } = req.params;
    const { newShortUrl } = req.body;
    if (!newShortUrl) {
        return res.status(400).json({ error: 'Invalid or missing new long URL' });
    }
    try {
        const urlRecord = await prisma.url.findFirst({
            where: { shortUrl, userId: req.user?.id },
        });
        if (!urlRecord) {
            return res.status(404).json({ error: 'URL not found or you do not have permission to modify it' });
        }
        const updatedUrl = await prisma.url.update({
            where: { id: urlRecord.id },
            data: { shortUrl: newShortUrl },
        });
        return res.status(200).json({
            message: 'URL updated successfully',
            url: {
                shortUrl: updatedUrl.shortUrl,
                longUrl: updatedUrl.longUrl,
            },
        });
    }
    catch (error) {
        console.error('Error updating URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
