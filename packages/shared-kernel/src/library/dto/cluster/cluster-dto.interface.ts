export interface ClusterDto {
    id: number;
    competenceId: number;
    lowerBound: number;
    upperBound: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
