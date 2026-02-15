export type UpdateTeamPayload = Partial<{
    title: string;
    description?: string | null;
    headId?: number | null;
}>;
