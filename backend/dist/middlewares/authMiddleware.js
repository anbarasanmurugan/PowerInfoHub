"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (!process.env.KEYCLOAK_PUBLIC_KEY) {
            console.warn("KEYCLOAK_PUBLIC_KEY not set in env. Proceeding with dummy check. ONLY FOR DEV.");
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                req.user = decoded;
                return next();
            }
            catch (err) {
                return res.sendStatus(403);
            }
        }
        const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.KEYCLOAK_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
        jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};
exports.authenticateJWT = authenticateJWT;
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Keycloak typically puts realm roles in realm_access.roles
        const realmRoles = user.realm_access?.roles || [];
        const clientRoles = user.resource_access?.[process.env.KEYCLOAK_CLIENT_ID || '']?.roles || [];
        if (realmRoles.includes(role) || clientRoles.includes(role) || user.role === role) {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
    };
};
exports.requireRole = requireRole;
