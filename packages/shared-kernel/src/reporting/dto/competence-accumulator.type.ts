export type CompetenceAccumulator = {
    competenceId: number;
    competenceTitle: string | null;
    selfScores: number[];
    teamScores: number[];
    otherScores: number[];
};
