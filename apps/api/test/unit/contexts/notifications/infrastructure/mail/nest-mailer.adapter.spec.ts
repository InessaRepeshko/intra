import { MailerService } from '@nestjs-modules/mailer';
import { NestMailerAdapter } from 'src/contexts/notifications/infrastructure/mail/nest-mailer.adapter';

describe('NestMailerAdapter', () => {
    let adapter: NestMailerAdapter;
    let mailerService: { sendMail: jest.Mock };

    beforeEach(() => {
        mailerService = { sendMail: jest.fn() };
        adapter = new NestMailerAdapter(
            mailerService as unknown as MailerService,
        );
    });

    describe('sendMail', () => {
        it('forwards the options to the underlying mailer service', async () => {
            await adapter.sendMail({
                to: 'jane@example.com',
                subject: 'Hello',
                template: 'user-welcome',
                context: { userFirstName: 'Jane' },
            });

            expect(mailerService.sendMail).toHaveBeenCalledWith({
                to: 'jane@example.com',
                subject: 'Hello',
                template: 'user-welcome',
                context: { userFirstName: 'Jane' },
                attachments: undefined,
            });
        });

        it('maps every attachment field through to nodemailer', async () => {
            const content = Buffer.from('abc');

            await adapter.sendMail({
                to: 'jane@example.com',
                subject: 'Hello',
                template: 'user-welcome',
                context: {},
                attachments: [
                    {
                        filename: 'logo.png',
                        content,
                        contentType: 'image/png',
                        cid: 'intra-logo',
                    },
                ],
            });

            const passed = mailerService.sendMail.mock.calls[0][0];
            expect(passed.attachments).toEqual([
                {
                    filename: 'logo.png',
                    content,
                    contentType: 'image/png',
                    cid: 'intra-logo',
                },
            ]);
        });
    });
});
