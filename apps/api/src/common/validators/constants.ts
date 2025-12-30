export const UserConstants = {
    PATTERN: /^[a-zA-Z-]+$/, // only English letters and hyphens
    PATTERN_WITH_NUMBERS: /^[a-zA-Z0-9_-]+$/, // only English letters, numbers, and hyphens
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    FULL_NAME_MIN_LENGTH: 1 * 3 + 2, // 3 names * 3 letters + 2 spaces
    FULL_NAME_MAX_LENGTH: 100 * 3 + 2, // 3 names * 100 letters + 2 spaces
    
    EMAIL_MIN_LENGTH: 1,
    EMAIL_MAX_LENGTH: 100,
    PASSWORD_HASH_MAX_LENGTH: 300,
}

export const TeamConstants = {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 255,
}

export const PositionConstants = {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 255,
}