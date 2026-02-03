export type UpdateCompetencePayload = Partial<{
    code?: string | null;
    title: string;
    description?: string | null;
}>;
