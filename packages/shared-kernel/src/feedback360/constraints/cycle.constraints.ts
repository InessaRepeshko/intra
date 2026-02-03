import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";


export const CYCLE_CONSTRAINTS = {
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
    ANONYMITY_THRESHOLD: {
        MIN: 3
    },
};
