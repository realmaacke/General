import { Router } from 'express';
import { engineIndex, searchIndex } from '../controllers/engineController.js';
const router = Router();
router.get('/', engineIndex);
router.get('/search', searchIndex);
export default router;
//# sourceMappingURL=engineRoutes.js.map