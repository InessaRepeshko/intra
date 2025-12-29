import { CreateTeamData, Team, UpdateTeamData } from '../model/team';

export interface TeamsRepository {
  create(data: CreateTeamData): Promise<Team>;
  findAll(): Promise<Team[]>;
  findById(id: number): Promise<Team | null>;
  findByHeadId(headId: number): Promise<Team[]>;
  findByMemberId(memberId: number): Promise<Team[]>;
  updateById(id: number, data: UpdateTeamData): Promise<Team>;
  deleteById(id: number): Promise<void>;
}


