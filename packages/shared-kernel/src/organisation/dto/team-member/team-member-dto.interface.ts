export interface TeamMemberDto {
    id: number;
    teamId: number;
    memberId: number;
    isPrimary: boolean;
    createdAt: Date;
}
