export type UpdateClusterPayload = Partial<{
    competenceId: number;
    lowerBound: number;
    upperBound: number;
    title: string;
    description: string;
}>;
