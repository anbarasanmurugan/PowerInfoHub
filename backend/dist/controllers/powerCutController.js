"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePowerCut = exports.updatePowerCut = exports.createPowerCut = exports.getPowerCuts = void 0;
const index_1 = require("../index");
const getPowerCuts = async (req, res) => {
    try {
        const { area, page = 1, limit = 10 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const where = area ? { area: { contains: area, mode: 'insensitive' } } : {};
        const powerCuts = await index_1.prisma.powerCut.findMany({
            where,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: { date: 'asc' },
        });
        const total = await index_1.prisma.powerCut.count({ where });
        res.json({
            data: powerCuts,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPowerCuts = getPowerCuts;
const createPowerCut = async (req, res) => {
    try {
        const user = req.user;
        let dbUser = await index_1.prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser) {
            dbUser = await index_1.prisma.user.create({
                data: {
                    keycloak_id: user.sub,
                    email: user.email || 'unknown@example.com',
                    role: 'ADMIN' // Only Admins reach here based on middleware
                }
            });
        }
        const { area, date, start_time, end_time, reason } = req.body;
        const powerCut = await index_1.prisma.powerCut.create({
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createPowerCut = createPowerCut;
const updatePowerCut = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const powerCut = await index_1.prisma.powerCut.update({
            where: { id },
            data: updateData
        });
        res.json(powerCut);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updatePowerCut = updatePowerCut;
const deletePowerCut = async (req, res) => {
    try {
        const { id } = req.params;
        await index_1.prisma.powerCut.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deletePowerCut = deletePowerCut;
