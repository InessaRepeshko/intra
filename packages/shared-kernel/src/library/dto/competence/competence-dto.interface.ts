export interface CompetenceDto {
    id: number;
    code: string | null;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
