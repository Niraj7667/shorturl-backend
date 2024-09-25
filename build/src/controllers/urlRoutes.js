import { nanoid } from "nanoid";
import prisma from "prisma/prismaClient";
export const shorten = async (req, res) => {
    const longUrl = req.body.originalUrl;
    if (!longUrl) {
        return res.status(400).json({ error: 'Missing original URL' });
    }
    const shortUrl = nanoid(6);
    try {
        const existingUrl = await prisma.url.findFirst({
            where: { longUrl, userId: req.user?.id },
        });
        if (existingUrl) {
            return res.status(200).json({
                message: "URL already shortened",
                url: {
                    shortUrl: existingUrl.shortUrl,
                    longUrl: existingUrl.longUrl,
                    userId: req.user?.id,
                }
            });
        }
        const result = await prisma.url.create({
            data: {
                longUrl,
                shortUrl,
                userId: req.user?.id,
            },
        });
        if (result) {
            return res.status(201).json({
                message: "ShortUrl successfully created",
                url: result,
            });
        }
        else {
            return res.status(501).json({ error: "Couldn't create shortUrl" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const redirect = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const urlRecord = await prisma.url.findUnique({
            where: { shortUrl },
        });
        if (!urlRecord) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        let longUrl = urlRecord.longUrl;
        if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
            longUrl = `http://${longUrl}`;
        }
        await prisma.url.update({
            where: { shortUrl },
            data: {
                clickCount: {
                    increment: 1,
                },
            },
        });
        return res.redirect(longUrl);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
