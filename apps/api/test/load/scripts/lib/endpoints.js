export const INTERACTIVE_ENDPOINTS = [
    { method: 'GET', path: '/auth/me', weight: 5, name: 'auth/me' },
    { method: 'GET', path: '/identity/users?limit=20', weight: 4, name: 'identity/users:search' },
    { method: 'GET', path: '/identity/roles', weight: 1, name: 'identity/roles:list' },
    { method: 'GET', path: '/organisation/teams?limit=20', weight: 3, name: 'organisation/teams:search' },
    { method: 'GET', path: '/organisation/positions?limit=20', weight: 2, name: 'organisation/positions:search' },
    { method: 'GET', path: '/reporting/reports?limit=20', weight: 3, name: 'reporting/reports:search' },
];

export function pickWeighted(items) {
    const total = items.reduce((s, e) => s + (e.weight || 1), 0);
    let r = Math.random() * total;
    for (const e of items) {
        r -= e.weight || 1;
        if (r <= 0) return e;
    }
    return items[items.length - 1];
}
