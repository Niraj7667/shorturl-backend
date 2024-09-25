import jwt from 'jsonwebtoken';
import prisma from 'prisma/prismaClient';
export const shortenMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid user' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};
