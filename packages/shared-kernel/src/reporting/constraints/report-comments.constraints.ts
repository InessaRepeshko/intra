import { GLOBAL_CONSTRAINTS } from '../../common/constraints/global.constraints';

export const REPORT_COMMENT_CONSTRAINTS = {
    TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    COMMENT: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
    NUMBER_OF_MENTIONS: {
        MIN: GLOBAL_CONSTRAINTS.PERCENTAGE.MIN,
        MAX: GLOBAL_CONSTRAINTS.PERCENTAGE.MAX,
    },
};
