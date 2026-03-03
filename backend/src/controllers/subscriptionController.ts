import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';

export const subscribeToArea = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        let dbUser = await prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    keycloak_id: user.sub,
                    email: user.email || 'unknown@example.com',
                    role: 'USER'
                }
            });
        }

        const { area } = req.body;

        // Check duplicate
        const existing = await prisma.subscription.findUnique({
            where: {
                user_id_area: {
                    user_id: dbUser.id,
                    area
                }
            }
        });

        if (existing) {
            return res.status(400).json({ message: "Already subscribed to this area" });
        }

        const subscription = await prisma.subscription.create({
            data: {
                user_id: dbUser.id,
                area
            }
        });

        res.status(201).json(subscription);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserSubscriptions = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const dbUser = await prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser) return res.json([]);

        const subs = await prisma.subscription.findMany({
            where: { user_id: dbUser.id }
        });
        res.json(subs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const unsubscribeFromArea = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const dbUser = await prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser) return res.status(404).json({ message: "User not found" });

        const { id } = req.params;
        await prisma.subscription.delete({
            where: { id: id as string }
        });

        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
