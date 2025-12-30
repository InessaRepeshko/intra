import { Feedback360Stage } from '../enums/feedback360-stage.enum';

/**
 * Domain-модель Feedback360 (не Prisma і не API-Entity).
 */
export class Feedback360Domain {
  readonly id?: number;
  readonly rateeId: number;
  readonly rateeNote: string | null;
  readonly positionId: number;
  readonly hrId: number;
  readonly hrNote: string | null;
  readonly cycleId: number | null;
  readonly stage: Feedback360Stage;
  readonly reportId: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: {
    id?: number;
    rateeId: number;
    rateeNote: string | null;
    positionId: number;
    hrId: number;
    hrNote: string | null;
    cycleId: number | null;
    stage: Feedback360Stage;
    reportId: number | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.rateeId = props.rateeId;
    this.rateeNote = props.rateeNote;
    this.positionId = props.positionId;
    this.hrId = props.hrId;
    this.hrNote = props.hrNote;
    this.cycleId = props.cycleId;
    this.stage = props.stage;
    this.reportId = props.reportId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}


