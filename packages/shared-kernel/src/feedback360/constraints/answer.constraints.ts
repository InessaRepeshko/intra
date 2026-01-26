import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const ANSWER_CONSTRAINTS = {
    NUMERICAL_VALUE: {
        MIN: 0,
        MAX: 5,
    },
    TEXT_VALUE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
};