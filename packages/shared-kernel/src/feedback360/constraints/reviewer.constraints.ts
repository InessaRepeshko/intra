import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const REVIEWER_CONSTRAINTS = {
    POSITION_TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.TITLE.LENGTH.MAX,
        },
    },
};