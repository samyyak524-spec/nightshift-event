import { Router } from 'express';
import {
  createVolunteer,
  listVolunteers,
  updateVolunteerStatus
} from '../controllers/volunteerController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = Router();
router.post('/', createVolunteer);
router.get('/', authRequired, authorize('super_admin', 'admin'), listVolunteers);
router.patch('/:id/status', authRequired, authorize('super_admin', 'admin'), updateVolunteerStatus);

export default router;
