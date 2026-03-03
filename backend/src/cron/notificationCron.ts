import cron from 'node-cron';
import { prisma } from '../index';

// Run every hour at the top of the hour
cron.schedule('0 * * * *', async () => {
    console.log('Running Notification Cron Job...');
    try {
        const today = new Date();
        // Assuming next 24 hours
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const upcomingCuts = await prisma.powerCut.findMany({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        for (const cut of upcomingCuts) {
            // Find subs
            const subscriptions = await prisma.subscription.findMany({
                where: { area: cut.area },
                include: { user: true }
            });

            for (const sub of subscriptions) {
                // Check if already notified
                const existingLog = await prisma.notificationLog.findFirst({
                    where: {
                        user_id: sub.user_id,
                        power_cut_id: cut.id
                    }
                });

                if (!existingLog) {
                    // Mock sending email
                    console.log(`Sending email to ${sub.user.email} regarding power cut in ${cut.area} on ${cut.date}`);

                    await prisma.notificationLog.create({
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
    } catch (error) {
        console.error('Error in Cron Job:', error);
    }
});
