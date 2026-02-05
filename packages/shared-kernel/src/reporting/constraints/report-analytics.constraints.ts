import { GLOBAL_CONSTRAINTS } from '../../common/constraints/global.constraints';

export const REPORT_ANALYTICS_CONSTRAINTS = {
    ENTITY_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    SCORE: {
        MIN: GLOBAL_CONSTRAINTS.SCORE.MIN,
        MAX: GLOBAL_CONSTRAINTS.SCORE.MAX,
    },
    PERCENTAGE: {
        MIN: GLOBAL_CONSTRAINTS.PERCENTAGE.MIN,
        MAX: GLOBAL_CONSTRAINTS.PERCENTAGE.MAX,
    },
};
