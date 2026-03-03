"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const powerCutController_1 = require("../controllers/powerCutController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
// Publicly viewable or only for authenticated users?
// Usually, we let anyone (authenticated) view power cuts
router.get('/', authMiddleware_1.authenticateJWT, powerCutController_1.getPowerCuts);
// Admin only routes
router.post('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('ADMIN'), (0, validateRequest_1.validateRequest)(validators_1.CreatePowerCutSchema), powerCutController_1.createPowerCut);
router.put('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('ADMIN'), (0, validateRequest_1.validateRequest)(validators_1.UpdatePowerCutSchema), powerCutController_1.updatePowerCut);
router.delete('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('ADMIN'), powerCutController_1.deletePowerCut);
exports.default = router;
