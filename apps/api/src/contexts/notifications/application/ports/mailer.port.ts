export const MAILER = Symbol('NOTIFICATIONS.MAILER');

export type MailerSendOptions = {
    to: string;
    subject: string;
    template: string;
    context: Record<string, unknown>;
};

export interface MailerPort {
    sendMail(options: MailerSendOptions): Promise<void>;
}
