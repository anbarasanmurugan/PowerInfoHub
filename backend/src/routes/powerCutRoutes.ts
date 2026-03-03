import { Router } from 'express';
import { getPowerCuts, createPowerCut, updatePowerCut, deletePowerCut } from '../controllers/powerCutController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { CreatePowerCutSchema, UpdatePowerCutSchema } from '../validators';

const router = Router();

// Publicly viewable or only for authenticated users?
// Usually, we let anyone (authenticated) view power cuts
router.get('/', authenticateJWT, getPowerCuts);

// Admin only routes
router.post('/', authenticateJWT, requireRole('ADMIN'), validateRequest(CreatePowerCutSchema), createPowerCut);
router.put('/:id', authenticateJWT, requireRole('ADMIN'), validateRequest(UpdatePowerCutSchema), updatePowerCut);
router.delete('/:id', authenticateJWT, requireRole('ADMIN'), deletePowerCut);

export default router;
