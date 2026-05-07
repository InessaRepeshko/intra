import { getEnvVarAsStr } from './env-utils';

export default () => {
    const user = getEnvVarAsStr('GOOGLE_GMAIL_USER');
    const fromName = process.env.MAIL_FROM_NAME ?? 'Intra Feedback360';

    return {
        mail: {
            from: process.env.MAIL_FROM ?? `${fromName} <${user}>`,
            replyTo:
                process.env.MAIL_REPLY_TO ??
                getEnvVarAsStr('APP_SUPPORT_EMAIL'),
            gmail: {
                user,
                clientId: getEnvVarAsStr('GOOGLE_CLIENT_ID'),
                clientSecret: getEnvVarAsStr('GOOGLE_CLIENT_SECRET'),
                refreshToken: getEnvVarAsStr('GOOGLE_GMAIL_API_REFRESH_TOKEN'),
                accessToken: process.env.GOOGLE_GMAIL_API_ACCESS_TOKEN,
            },
        },
    };
};
