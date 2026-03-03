"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const index_1 = require("../index");
// Run every hour at the top of the hour
node_cron_1.default.schedule('0 * * * *', async () => {
    console.log('Running Notification Cron Job...');
    try {
        const today = new Date();
        // Assuming next 24 hours
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const upcomingCuts = await index_1.prisma.powerCut.findMany({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        for (const cut of upcomingCuts) {
            // Find subs
            const subscriptions = await index_1.prisma.subscription.findMany({
                where: { area: cut.area },
                include: { user: true }
            });
            for (const sub of subscriptions) {
                // Check if already notified
                const existingLog = await index_1.prisma.notificationLog.findFirst({
                    where: {
                        user_id: sub.user_id,
                        power_cut_id: cut.id
                    }
                });
                if (!existingLog) {
                    // Mock sending email
                    console.log(`Sending email to ${sub.user.email} regarding power cut in ${cut.area} on ${cut.date}`);
                    await index_1.prisma.notificationLog.create({
                        data: {
                            user_id: sub.user_id,
                            power_cut_id: cut.id,
                            status: 'SENT'
                        }
                    });
                }
            }
        }
        console.log('Notification Cron Job finished.');
    }
    catch (error) {
        console.error('Error in Cron Job:', error);
    }
});
