import { UserDto } from '../../../identity/dto/user/user-dto.interface';
import { ClusterDto } from '../../../library/dto/cluster/cluster-dto.interface';

export interface ClusterScoreWithRelationsDto {
    id: number;
    cycleId?: number | null;
    clusterId: number;
    rateeId: number;
    reviewId: number;
    score: number;
    answersCount: number;
    createdAt: Date;
    updatedAt: Date;
    cluster: ClusterDto;
    ratee: UserDto;
}
