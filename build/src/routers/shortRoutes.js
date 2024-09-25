import express from 'express';
import { redirect } from 'src/controllers/urlRoutes';
const router = express.Router();
router.get('/:shortUrl', redirect);
export default router;
