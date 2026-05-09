import { CONNECTION_LIMIT } from './constants';
import { getEnvVarAsInt, getEnvVarAsStr } from './env-utils';

export default () => ({
    database: {
        host: getEnvVarAsStr('DATABASE_HOST'),
        port: getEnvVarAsInt('DATABASE_PORT'),
        user: getEnvVarAsStr('DATABASE_USER'),
        password: getEnvVarAsStr('DATABASE_PASSWORD'),
        name: getEnvVarAsStr('DATABASE_NAME'),
        url: getEnvVarAsStr('DATABASE_URL'),
        connectionLimit: CONNECTION_LIMIT,
    },
});
