import { UserDomain } from '../../../domain/user.domain';
import { UserResponse } from '../models/user.response';

export class UserHttpMapper {
    static toResponse(domain: UserDomain): UserResponse {
        const view = new UserResponse();
        view.id = domain.id!;
        view.firstName = domain.firstName;
        view.secondName = domain.secondName ?? null;
        view.lastName = domain.lastName;
        view.fullName = domain.fullName ?? null;
        view.email = domain.email;
        view.status = domain.status;
        view.positionId = domain.positionId;
        view.teamId = domain.teamId ?? null;
        view.managerId = domain.managerId ?? null;
        view.roles = domain.roles;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }
}
