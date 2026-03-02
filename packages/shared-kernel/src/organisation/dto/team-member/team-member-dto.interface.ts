export interface TeamMemberBaseDto<TDate = Date> {
    id: number;
    teamId: number;
    memberId: number;
    isPrimary: boolean;
    createdAt: TDate;
}

export type TeamMemberDto = TeamMemberBaseDto<Date>;

export type TeamMemberResponseDto = TeamMemberBaseDto<string>;
