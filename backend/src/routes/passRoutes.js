import { Router } from 'express';
import {
  createPass,
  listAllPasses,
  listPublicPasses,
  reorderPasses,
  updatePass
} from '../controllers/passController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/public', listPublicPasses);
router.get('/', authRequired, authorize('super_admin', 'admin'), listAllPasses);
router.post('/', authRequired, authorize('super_admin'), createPass);
router.patch('/:id', authRequired, authorize('super_admin'), updatePass);
router.post('/reorder', authRequired, authorize('super_admin'), reorderPasses);

export default router;
