import { GLOBAL_CONSTRAINTS } from '../../common/constraints/global.constraints';

export const REVIEW_CONSTRAINTS = {
    TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    DESCRIPTION: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
    NOTE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
    COMMENT: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
};