import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { PushSubscription } from '../users/entities/push-subscription.entity';
import { NotificationGateway } from './gateways/notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { NotificationProcessor } from './processors/notification.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, PushSubscription, User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configSvc: ConfigService) => ({
                secret: configSvc.getOrThrow<string>('JWT_SECRET'),
            }),
        }),
        BullModule.registerQueue({
            name: 'notification-queue',
        }),
        TelegramModule,
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationGateway, NotificationProcessor],
    exports: [NotificationsService, NotificationGateway],
})
export class NotificationsModule { }
