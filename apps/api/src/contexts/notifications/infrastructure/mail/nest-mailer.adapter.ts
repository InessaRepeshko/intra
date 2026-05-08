import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
    MAILER,
    MailerPort,
    MailerSendOptions,
} from '../../application/ports/mailer.port';

@Injectable()
export class NestMailerAdapter implements MailerPort {
    readonly [MAILER] = MAILER;

    constructor(private readonly mailerService: MailerService) {}

    async sendMail(options: MailerSendOptions): Promise<void> {
        await this.mailerService.sendMail({
            to: options.to,
            subject: options.subject,
            template: options.template,
            context: options.context,
            attachments: options.attachments?.map((a) => ({
                filename: a.filename,
                content: a.content,
                contentType: a.contentType,
                cid: a.cid,
            })),
        });
    }
}
