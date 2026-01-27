import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const CLUSTER_CONSTRAINTS = {
    SCORE: {
        MIN: 0,
        MAX: 5,
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
}