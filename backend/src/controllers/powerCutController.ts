import { Request, Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getPowerCuts = async (req: Request, res: Response) => {
    try {
        const { area, page = 1, limit = 10 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const where = area ? { area: { contains: area as string, mode: 'insensitive' as any } } : {};

        const powerCuts = await prisma.powerCut.findMany({
            where,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: { date: 'asc' },
        });

        const total = await prisma.powerCut.count({ where });

        res.json({
            data: powerCuts,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createPowerCut = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        let dbUser = await prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    keycloak_id: user.sub,
                    email: user.email || 'unknown@example.com',
                    role: 'ADMIN' // Only Admins reach here based on middleware
                }
            });
        }

        const { area, date, start_time, end_time, reason } = req.body;
        const powerCut = await prisma.powerCut.create({
            data: {
                area,
                date: new Date(date),
                start_time,
                end_time,
                reason,
                created_by: dbUser.id
            }
        });

        res.status(201).json(powerCut);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updatePowerCut = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }

        const powerCut = await prisma.powerCut.update({
            where: { id: id as string },
            data: updateData
        });
        res.json(powerCut);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deletePowerCut = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.powerCut.delete({ where: { id: id as string } });
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
