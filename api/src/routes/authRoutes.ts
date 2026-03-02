import { Router } from 'express';

import { authIndex, authGuard, authLogin, authRegister } from "../controllers/authController.js";

const router = Router();

router.get('/', authIndex);
router.get('/check', authGuard);

router.post('/login', authLogin)
router.post('/register', authRegister)

export default router;
