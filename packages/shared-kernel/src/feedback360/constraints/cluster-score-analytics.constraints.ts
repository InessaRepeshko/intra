import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const CLUSTER_SCORE_ANALYTICS_CONSTRAINTS = {
    EMPLOYEES_COUNT: {
        MIN: 1,
    },
    SCORE: {
        MIN: GLOBAL_CONSTRAINTS.SCORE.MIN,
        MAX: GLOBAL_CONSTRAINTS.SCORE.MAX,
    },
};