import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request object to include the authenticated user
export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        const isPlaceholder = !process.env.KEYCLOAK_PUBLIC_KEY || process.env.KEYCLOAK_PUBLIC_KEY.includes('YOUR_REALM_PUBLIC_KEY');

        if (isPlaceholder) {
            console.warn("KEYCLOAK_PUBLIC_KEY not set or is placeholder. Using jwt.decode (DEV ONLY).");
            try {
                const decoded = jwt.decode(token);
                if (!decoded) throw new Error("Could not decode token");
                req.user = decoded;
                return next();
            } catch (err) {
                console.error("Token decode failed:", err);
                return res.status(403).json({ message: 'Invalid token structure' });
            }
        }

        const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.KEYCLOAK_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(403).json({ message: 'Invalid or expired token', detail: err.message });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Keycloak typically puts realm roles in realm_access.roles
        const realmRoles = user.realm_access?.roles || [];
        const clientRoles = user.resource_access?.[process.env.KEYCLOAK_CLIENT_ID || '']?.roles || [];

        if (realmRoles.includes(role) || clientRoles.includes(role) || user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
    };
};
