export const MAILER = Symbol('NOTIFICATIONS.MAILER');

export type MailerAttachment = {
    filename: string;
    content: Buffer;
    contentType?: string;
    /**
     * Content-ID for inline embedding. When set, the attachment is rendered
     * inline by mail clients via `<img src="cid:<cid>">` references in the
     * HTML body. Used here to embed the brand logo so Gmail (which strips
     * data: URIs in <img>) still displays it.
     */
    cid?: string;
};

export type MailerSendOptions = {
    to: string;
    subject: string;
    template: string;
    context: Record<string, unknown>;
    attachments?: MailerAttachment[];
};

export interface MailerPort {
    sendMail(options: MailerSendOptions): Promise<void>;
}
