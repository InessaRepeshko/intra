import { UserDto } from "../../../identity/dto/user/user-dto.interface";

export interface TeamMemberDto {
    id: number;
    teamId: number;
    memberId: number;
    isPrimary: boolean;
    createdAt: Date;
}