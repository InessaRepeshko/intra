import Decimal from 'decimal.js';

export type QuestionAccumulator = {
    questionId: number;
    questionTitle: string | null;
    selfScores: Decimal.Value[];
    teamScores: Decimal.Value[];
    otherScores: Decimal.Value[];
};
