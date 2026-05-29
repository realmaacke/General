import { Router } from 'express';
import { infoController } from '../controllers/infoController.js';
const router = Router();
router.get('server', infoController);
export default router;
//# sourceMappingURL=infoRoutes.js.map