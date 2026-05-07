import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';
import { DatabaseModule } from 'src/database/database.module';
import { Feedback360Module } from '../feedback360/feedback360.module';
import { IdentityModule } from '../identity/identity.module';
import { ReviewStageNotificationListener } from './application/listeners/review-stage-notification.listener';
import { MAILER } from './application/ports/mailer.port';
import { NOTIFICATION_LOG_REPOSITORY } from './application/ports/notification-log.repository.port';
import { ReviewEmailNotificationService } from './application/services/review-email-notification.service';
import { NestMailerAdapter } from './infrastructure/mail/nest-mailer.adapter';
import { NotificationLogRepository } from './infrastructure/prisma-repositories/notification-log.repository';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        DatabaseModule,
        IdentityModule,
        Feedback360Module,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const gmail = configService.get<{
                    user: string;
                    clientId: string;
                    clientSecret: string;
                    refreshToken: string;
                    accessToken?: string;
                }>('mail.gmail');

                return {
                    transport: {
                        service: 'gmail',
                        auth: {
                            type: 'OAuth2',
                            user: gmail!.user,
                            clientId: gmail!.clientId,
                            clientSecret: gmail!.clientSecret,
                            refreshToken: gmail!.refreshToken,
                            accessToken: gmail!.accessToken,
                        },
                    },
                    defaults: {
                        from: configService.get<string>('mail.from'),
                        replyTo: configService.get<string>('mail.replyTo'),
                    },
                    template: {
                        dir: join(__dirname, 'infrastructure', 'templates'),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: false,
                        },
                    },
                };
            },
        }),
    ],
    providers: [
        ReviewStageNotificationListener,
        ReviewEmailNotificationService,
        NestMailerAdapter,
        NotificationLogRepository,
        { provide: MAILER, useExisting: NestMailerAdapter },
        {
            provide: NOTIFICATION_LOG_REPOSITORY,
            useExisting: NotificationLogRepository,
        },
    ],
})
export class NotificationsModule {}
