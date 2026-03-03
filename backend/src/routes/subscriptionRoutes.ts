import { Router } from 'express';
import { subscribeToArea, getUserSubscriptions, unsubscribeFromArea } from '../controllers/subscriptionController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { SubscribeSchema } from '../validators';

const router = Router();

// Normal user routes
router.post('/', authenticateJWT, requireRole('USER'), validateRequest(SubscribeSchema), subscribeToArea);
router.get('/', authenticateJWT, requireRole('USER'), getUserSubscriptions);
router.delete('/:id', authenticateJWT, requireRole('USER'), unsubscribeFromArea);

export default router;
