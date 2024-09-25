import express from "express";
import { login, logout, signup } from "src/controllers/authRoutes";

import { validateInput } from 'src/middlewares/validate';
import {checkAuth} from "src/controllers/checkAuth";

const router = express.Router();
router.post("/signup", validateInput, signup);
router.post("/login", validateInput, login);
router.get('/check', checkAuth);
    router.get("/logout", logout);

    export default router;