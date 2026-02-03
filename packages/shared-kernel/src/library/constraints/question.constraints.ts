import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const QUESTION_TEMPLATE_CONSTRAINTS = {
    TITLE: {
        LENGTH: {
            MIN: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
            MAX: GLOBAL_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
        },
    },
};

