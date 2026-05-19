import { Router } from 'express';
import { dataUsage } from '../controllers/dataController.js';
const router = Router();
router.get('server');
router.get('/usage', dataUsage);
export default router;
//# sourceMappingURL=infoRoutes.js.map