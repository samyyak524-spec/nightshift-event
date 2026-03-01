import { Router } from 'express';
import {
  addAdmin,
  getDashboard,
  getEventContent,
  removeAdmin,
  updateEventContent
} from '../controllers/adminController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = Router();
router.use(authRequired, authorize('super_admin', 'admin'));
router.get('/dashboard', getDashboard);
router.get('/event-content', getEventContent);
router.patch('/event-content', authorize('super_admin'), updateEventContent);
router.post('/admins', authorize('super_admin'), addAdmin);
router.delete('/admins/:id', authorize('super_admin'), removeAdmin);

export default router;
