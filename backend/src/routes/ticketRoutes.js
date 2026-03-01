import { Router } from 'express';
import {
  createOrder,
  myTickets,
  scanTicket,
  verifyPaymentAndIssueTicket
} from '../controllers/ticketController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = Router();
router.post('/order', authRequired, createOrder);
router.post('/verify', authRequired, verifyPaymentAndIssueTicket);
router.get('/mine', authRequired, myTickets);
router.post('/scan', authRequired, authorize('super_admin', 'admin', 'staff'), scanTicket);

export default router;
