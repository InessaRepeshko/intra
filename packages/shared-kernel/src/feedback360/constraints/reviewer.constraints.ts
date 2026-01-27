import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const REVIEWER_CONSTRAINTS = {
    FULL_NAME: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
        },
    },
    POSITION_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
    TEAM_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
};