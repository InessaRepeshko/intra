export interface ClusterBaseDto<TDate = Date> {
    id: number;
    competenceId: number;
    lowerBound: number;
    upperBound: number;
    title: string;
    description: string;
    createdAt: TDate;
    updatedAt: TDate;
}

export type ClusterDto = ClusterBaseDto<Date>;

export type ClusterResponseDto = ClusterBaseDto<string>;
