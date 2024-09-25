import express from "express";
import { shortenMiddleware } from "src/middlewares/shorten";
import { deleteUrl } from "src/controllers/delete";

const router = express.Router();

router.delete('/urls/:id',shortenMiddleware,deleteUrl );

export default router;