import express from "express";
import { shorten} from "src/controllers/urlRoutes";
import { getUserUrls } from "src/controllers/getUserUrls";
import { shortenMiddleware } from "src/middlewares/shorten";
const router = express.Router();
router.post("/shorten",shortenMiddleware,shorten);
router.get("/urls",shortenMiddleware,getUserUrls);

export default router;