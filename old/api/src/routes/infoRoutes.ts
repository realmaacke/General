import { Router } from 'express';

import { infoController } from '../controllers/infoController.js';

const router = Router();

router.get('/server', infoController);
router.get('/', infoController);

export default router;
