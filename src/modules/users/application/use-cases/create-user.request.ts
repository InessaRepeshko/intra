export type CreateUserRequest = {
  firstName: string;
  secondName?: string | null;
  lastName: string;
  email: string;
  password: string;
  positionId: number;
  teamId: number;
  managerId?: number | null;
};


