export const GLOBAL_CONSTRAINTS = {
    TITLE: {
        LENGTH: {
            MIN: 1,
            MAX: 255,
        },
    },
    DESCRIPTION: {
        LENGTH: {
            MIN: 1,
            MAX: 1000,
        },
    },
    FULL_NAME: {
        LENGTH: {
            MIN: 1,
            MAX: 302, // 3 names * 100 letters + 2 spaces
        },
    },
    SCORE: {
        MIN: 0,
        MAX: 5,
    },
    ANONYMITY_THRESHOLD: {
        MIN: 3,
    },
    PERCENTAGE: {
        MIN: 0.0,
        MAX: 100.0,
    },
};
