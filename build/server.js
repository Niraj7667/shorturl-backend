import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "prisma/prismaClient";
import authRoutes from "./src/routers/authRoutes";
import urlRoutes from "./src/routers/urlRoutes";
import apiRoutes from "./src/routers/apiRoutes";
import shorty from "./src/routers/shortRoutes";
import deleteRoute from "./src/routers/deleteRoute";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;
app
    .use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
    .use(helmet())
    .use(morgan("dev"))
    .use(express.json())
    .use(cookieParser());
app.use('/auth', authRoutes);
app.use('/api', urlRoutes);
app.use('/api', apiRoutes);
app.use('/delete', deleteRoute);
app.use('', shorty);
app.get("/", async (res) => {
    return res.status(201).json({
        msg: "Hello world"
    });
});
app.get("/info", async (req, res) => {
    const data = await prisma.url.findMany({});
    return res.status(201).json({
        msg: "Success",
        request: req.body,
        data: data,
    });
});
app.listen(PORT, () => {
    console.log(`Service active on PORT ${PORT}`);
});
