export const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';
export const DEV_LOGIN_EMAIL = __ENV.DEV_LOGIN_EMAIL || 'oleksandr.bondarenko@intra.com';

export const SLO = {
    INTERACTIVE_P95_MS: 500,
    PDF_BUDGET_MS: 15000,
    ERROR_RATE: 0.01,
};

export const SEED_EMAILS = [
    'oleksandr.bondarenko@intra.com',
    'dmytro.kovalenko@intra.com',
    'iryna.shevchenko@intra.com',
    'olena.boyko@intra.com',
    'andrii.melnyk@intra.com',
    'natalya.tkachenko@intra.com',
    'mariia.pavlenko@intra.com',
    'yulia.kravchenko@intra.com',
];
