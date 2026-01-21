import { CYCLE_CONSTRAINTS } from "../constraints/cycle.constraints";

export const isAnonymityThresholdMet = (
    responses: number,
    threshold: number = CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN
): boolean => {
    return responses >= threshold;
}