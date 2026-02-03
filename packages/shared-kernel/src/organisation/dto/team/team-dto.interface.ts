export interface TeamDto {
    id: number;
    title: string;
    description: string | null;
    headId: number | null;
    createdAt: Date;
    updatedAt: Date;
}
