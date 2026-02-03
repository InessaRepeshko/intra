import { GLOBAL_CONSTRAINTS } from '../../common/constraints/global.constraints';

export const COMPETENCE_CONSTRAINTS = {
    CODE: {
        LENGTH: {
            MIN: 1,
            MAX: 100,
        },
    },
    TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    DESCRIPTION: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
};
