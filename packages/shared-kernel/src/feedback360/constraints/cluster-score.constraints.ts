import { GLOBAL_CONSTRAINTS } from "../../common/constraints/global.constraints";

export const CLUSTER_SCORE_CONSTRAINTS = {
    SCORE: {
        MIN: GLOBAL_CONSTRAINTS.SCORE.MIN,
        MAX: GLOBAL_CONSTRAINTS.SCORE.MAX,
    },
    ANSWER_COUNT: {
        MIN: 1,
    },
};