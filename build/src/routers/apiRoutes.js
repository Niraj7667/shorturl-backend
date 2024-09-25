import express from "express";
import { updateUrl } from "src/controllers/updateUrl";
import { shortenMiddleware } from "src/middlewares/shorten";
const router = express.Router();
router.put("/update/urls/:shortUrl", shortenMiddleware, updateUrl);
export default router;
