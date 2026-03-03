"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeFromArea = exports.getUserSubscriptions = exports.subscribeToArea = void 0;
const index_1 = require("../index");
const subscribeToArea = async (req, res) => {
    try {
        const user = req.user;
        let dbUser = await index_1.prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser) {
            dbUser = await index_1.prisma.user.create({
                data: {
                    keycloak_id: user.sub,
                    email: user.email || 'unknown@example.com',
                    role: 'USER'
                }
            });
        }
        const { area } = req.body;
        // Check duplicate
        const existing = await index_1.prisma.subscription.findUnique({
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
        const subscription = await index_1.prisma.subscription.create({
            data: {
                user_id: dbUser.id,
                area
            }
        });
        res.status(201).json(subscription);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.subscribeToArea = subscribeToArea;
const getUserSubscriptions = async (req, res) => {
    try {
        const user = req.user;
        const dbUser = await index_1.prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser)
            return res.json([]);
        const subs = await index_1.prisma.subscription.findMany({
            where: { user_id: dbUser.id }
        });
        res.json(subs);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getUserSubscriptions = getUserSubscriptions;
const unsubscribeFromArea = async (req, res) => {
    try {
        const user = req.user;
        const dbUser = await index_1.prisma.user.findUnique({ where: { keycloak_id: user.sub } });
        if (!dbUser)
            return res.status(404).json({ message: "User not found" });
        const { id } = req.params;
        await index_1.prisma.subscription.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.unsubscribeFromArea = unsubscribeFromArea;
