import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '../../telegram/telegram.service';
import { User } from '../../users/entities/user.entity';
import { PushSubscription } from '../../users/entities/push-subscription.entity';

@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
    private readonly logger = new Logger(NotificationProcessor.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(PushSubscription)
        private readonly pushRepo: Repository<PushSubscription>,
        private readonly configService: ConfigService,
        private readonly telegramService: TelegramService,
    ) {
        super();
        const publicVapidKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
        const privateVapidKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
        const email = this.configService.get<string>('VAPID_EMAIL', 'admin@example.com');

        if (publicVapidKey && privateVapidKey) {
            webpush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);
        }
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { userId, message, payload, options } = job.data;

        switch (job.name) {
            case 'send-delivery':
                await Promise.all([
                    this.sendWebPush(userId, payload),
                    options?.skipTelegram ? Promise.resolve() : this.sendTelegram(userId, message),
                ]);
                break;
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }

    private async sendTelegram(userId: string, message: string) {
        try {
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (user) {
                if (user.telegramId) {
                    await this.telegramService.sendMessage([user.telegramId], `🔔 <b>Yangi bildirishnoma:</b>\n\n${message}`);
                } else if (user.phoneNumber) {
                    await this.telegramService.sendToEmployee(user.phoneNumber, `🔔 <b>Yangi bildirishnoma:</b>\n\n${message}`);
                }
            }
        } catch (err) {
            this.logger.error(`Failed to send Telegram notification to user ${userId}: ${err.message}`);
        }
    }

    private async sendWebPush(userId: string, payload: any) {
        const subscriptions = await this.pushRepo.find({ where: { userId } });
        
        // Parallelized delivery for multiple devices
        const pushPromises = subscriptions.map(async (sub) => {
            try {
                const pushConfig = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    },
                };
                await webpush.sendNotification(pushConfig, JSON.stringify(payload));
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    this.logger.log(`Removing expired subscription for user ${userId}`);
                    await this.pushRepo.remove(sub);
                } else {
                    this.logger.error(`Error sending web push: ${err.message}`);
                }
            }
        });

        await Promise.all(pushPromises);
    }
}
