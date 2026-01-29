export enum UserSortField {
    ID = 'id',
    FIRST_NAME = 'firstName',
    SECOND_NAME = 'secondName',
    LAST_NAME = 'lastName',
    FULL_NAME = 'fullName',
    EMAIL = 'email',
    STATUS = 'status',
    POSITION_ID = 'positionId',
    TEAM_ID = 'teamId',
    MANAGER_ID = 'managerId',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    ROLES = 'roles',
}

export const USER_SORT_FIELDS = Object.values(UserSortField);