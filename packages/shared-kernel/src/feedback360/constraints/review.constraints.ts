import { GLOBAL_CONSTRAINTS } from '../../common/constraints/global.constraints';

export const REVIEW_CONSTRAINTS = {
    RATEE_POSITION_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    HR_NOTE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
    TEAM_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
};