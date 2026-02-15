import Decimal from 'decimal.js';

export type CompetenceAccumulator = {
    competenceId: number;
    competenceTitle: string | null;
    selfScores: Decimal.Value[];
    teamScores: Decimal.Value[];
    otherScores: Decimal.Value[];
};
