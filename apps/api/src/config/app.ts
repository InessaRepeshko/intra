<<<<<<< HEAD
import {
    DOCUMENTATION_PREFIX,
    LOGO_FILENAME,
    PUBLIC_DIR_PATH,
    VERSION,
} from './constants';
import { getEnvVarAsInt, getEnvVarAsStr } from './env-utils';

export const getAppName = () => getEnvVarAsStr('APP_NAME');

export const getApiVersion = () => VERSION ?? process.env.npm_package_version;

export default () => {
    const frontendProtocol = getEnvVarAsStr('APP_FRONTEND_PROTOCOL');
    const frontendHost = getEnvVarAsStr('APP_FRONTEND_HOST');
    const frontendPort = getEnvVarAsInt('APP_FRONTEND_PORT');
    const nodeEnv = getEnvVarAsStr('APP_NODE_ENV');
    const appName = getAppName();

    return {
        app: {
            name: appName,
            version: getApiVersion(),
            domain: getEnvVarAsStr('APP_DOMAIN'),
            supportEmail: getEnvVarAsStr('APP_SUPPORT_EMAIL'),
            protocol: getEnvVarAsStr('APP_PROTOCOL'),
            port: getEnvVarAsInt('APP_PORT'),
            host: getEnvVarAsStr('APP_HOST'),
            globalPrefix: DOCUMENTATION_PREFIX,
            frontendProtocol,
            frontendHost,
            frontendPort,
            frontendLink:
                frontendPort && nodeEnv !== 'production'
                    ? `${frontendProtocol}://${frontendHost}:${frontendPort}/`
                    : `${frontendProtocol}://${frontendHost}/`,
            nodeEnv,
            logo: {
                path: PUBLIC_DIR_PATH,
                filename: LOGO_FILENAME,
            },
            // cors: {
            //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            //     allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN'],
            //     credentials: true,
            // },
            // csrf: {
            //     cookie: {
            //         key: 'X-CSRF-TOKEN',
            //         httpOnly: true,
            //         secure: nodeEnv === 'production',
            //         sameSite: 'strict',
            //     },
            //     ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
            // },
        },
    };
};
=======
import { getEnvVarAsStr, getEnvVarAsInt } from './env-utils';
import { VERSION, DOCUMENTATION_PREFIX, LOGO_FILENAME, PUBLIC_DIR_PATH } from './constants';
import { version } from '../../../../package.json';

export const getAppName = () => getEnvVarAsStr('APP_NAME');

export const getApiVersion = () => VERSION ?? version;

export default () => {
    const frontendProtocol = getEnvVarAsStr('APP_FRONTEND_PROTOCOL');
    const frontendHost = getEnvVarAsStr('APP_FRONTEND_HOST');
    const frontendPort = getEnvVarAsInt('APP_FRONTEND_PORT');
    const nodeEnv = getEnvVarAsStr('APP_NODE_ENV');
    const appName = getAppName();

    return {
        app: {
            name: appName,
            version: getApiVersion(),
            domain: getEnvVarAsStr('APP_DOMAIN'),
            supportEmail: getEnvVarAsStr('APP_SUPPORT_EMAIL'),
            protocol: getEnvVarAsStr('APP_PROTOCOL'),
            port: getEnvVarAsInt('APP_PORT'),
            host: getEnvVarAsStr('APP_HOST'),
            globalPrefix: DOCUMENTATION_PREFIX,
            frontendProtocol,
            frontendHost,
            frontendPort,
            frontendLink: frontendPort && nodeEnv !== 'production'
                ? `${frontendProtocol}://${frontendHost}:${frontendPort}/`
                : `${frontendProtocol}://${frontendHost}/`,
            nodeEnv,
            logo: {
                path: PUBLIC_DIR_PATH,
                filename: LOGO_FILENAME,
            },
            // cors: {
            //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            //     allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN'],
            //     credentials: true,
            // },
            // csrf: {
            //     cookie: {
            //         key: 'X-CSRF-TOKEN',
            //         httpOnly: true,
            //         secure: nodeEnv === 'production',
            //         sameSite: 'strict',
            //     },
            //     ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
            // },
        },
    };
};
>>>>>>> origin/main
