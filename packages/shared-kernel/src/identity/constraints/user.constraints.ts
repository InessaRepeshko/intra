const USER_NAME = {
    LENGTH: {
        MIN: 1,
        MAX: 100,
    },
    PATTERN: {
        ONLY_LETTERS: /^[a-zA-Z-]+$/, // only English letters and hyphens
        ONLY_LETTERS_AND_NUMBERS: /^[a-zA-Z0-9_-]+$/, // only English letters, numbers, and hyphens
    }
}

export const USER_CONSTRAINTS = {
    NAME: {
        LENGTH: {
            MIN: USER_NAME.LENGTH.MIN,
            MAX: USER_NAME.LENGTH.MAX,
        },
        PATTERN: USER_NAME.PATTERN.ONLY_LETTERS,
    },
    FULL_NAME: {
        LENGTH: {
            MIN: USER_NAME.LENGTH.MIN,
            MAX: USER_NAME.LENGTH.MAX * 3 + 2, // 3 names * 3 letters + 2 spaces
        },
        PATTERN: USER_NAME.PATTERN.ONLY_LETTERS,
    },
    EMAIL: {
        LENGTH: {
            MIN: 1,
            MAX: USER_NAME.LENGTH.MAX,
        },
        PATTERN: USER_NAME.PATTERN.ONLY_LETTERS_AND_NUMBERS,
    },
    PASSWORD_HASH: {
        LENGTH: {
            MAX: 300,
        },
    },
}
