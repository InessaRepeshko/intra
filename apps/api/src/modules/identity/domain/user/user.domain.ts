import { UsersStatus } from './users-status.enum';
import { PositionDomain } from '../position/position.domain';
import { TeamDomain } from '../team/team.domain';

export class UserDomain {
  readonly id?: number;
  readonly firstName: string;
  readonly secondName: string | null;
  readonly lastName: string;
  readonly fullName: string | null;
  readonly email: string;
  readonly passwordHash: string;
  readonly status?: UsersStatus;
  readonly positionId: number;
  readonly teamId: number;
  readonly managerId: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly position?: PositionDomain;
  readonly team?: TeamDomain;
  readonly manager?: UserDomain;
  readonly subordinates?: UserDomain[];
  readonly teamsLed?: TeamDomain[];

  constructor(props: {
    id?: number;
    firstName: string;
    secondName: string | null;
    lastName: string;
    fullName: string | null;
    email: string;
    passwordHash: string;
    status?: UsersStatus;
    positionId: number;
    teamId: number;
    managerId: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    position?: PositionDomain;
    team?: TeamDomain;
    manager?: UserDomain;
    subordinates?: UserDomain[];
    teamsLed?: TeamDomain[];
  }) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.secondName = props.secondName;
    this.lastName = props.lastName;
    this.fullName = props.fullName;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.status = props.status;
    this.positionId = props.positionId;
    this.teamId = props.teamId;
    this.managerId = props.managerId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.position = props.position;
    this.team = props.team;
    this.manager = props.manager;
    this.subordinates = props.subordinates;
    this.teamsLed = props.teamsLed;
  }
}


