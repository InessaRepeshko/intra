import { GLOBAL_CONSTRAINTS } from '../../common/constraints/global.constraints';

export const REVIEW_QUESTION_RELATION_CONSTRAINTS = {
    QUESTION_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    COMPETENCE_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    COMPETENCE_CODE: {
        LENGTH: {
            MIN: 1,
            MAX: 100,
        },
    },
};
