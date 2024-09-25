import express from 'express';
import { redirect } from 'src/controllers/urlRoutes';

const router = express.Router();

// Redirect route for short URLs
router.get('/:shortUrl', redirect);

export default router;
