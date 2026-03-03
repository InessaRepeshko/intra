import { UserBaseDto } from '../../../identity/dto/user/user-dto.interface';
import { ClusterBaseDto } from '../../../library/dto/cluster/cluster-dto.interface';

export interface ClusterScoreWithRelationsBaseDto<TDate = Date> {
    id: number;
    cycleId?: number | null;
    clusterId: number;
    rateeId: number;
    reviewId: number;
    score: number;
    answersCount: number;
    createdAt: TDate;
    updatedAt: TDate;
    cluster: ClusterBaseDto<TDate>;
    ratee: UserBaseDto<TDate>;
}

export type ClusterScoreWithRelationsDto =
    ClusterScoreWithRelationsBaseDto<Date>;

export type ClusterScoreWithRelationsResponseDto =
    ClusterScoreWithRelationsBaseDto<string>;
