"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
// Normal user routes
router.post('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('USER'), (0, validateRequest_1.validateRequest)(validators_1.SubscribeSchema), subscriptionController_1.subscribeToArea);
router.get('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('USER'), subscriptionController_1.getUserSubscriptions);
router.delete('/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('USER'), subscriptionController_1.unsubscribeFromArea);
exports.default = router;
