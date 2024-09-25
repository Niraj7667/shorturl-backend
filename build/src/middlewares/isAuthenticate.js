import jwt from 'jsonwebtoken';
import prisma from "prisma/prismaClient";
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (!decoded.userId) {
                return res.status(401).json({ message: 'Unauthorized - Missing userId in token' });
            }
            req.user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized - Invalid user' });
            }
            next();
        }
        catch (error) {
            console.error("Error in authentication middleware:", error);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized - No token provided" });
    }
};
