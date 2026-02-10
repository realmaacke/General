import { Router } from 'express';

import { engineIndex } from '../controllers/engineController.js';

const router = Router();

router.get('/', engineIndex);

export default router;
