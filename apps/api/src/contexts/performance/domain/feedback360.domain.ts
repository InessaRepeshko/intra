import { Feedback360Stage } from './feedback360-stage.enum';

export type Feedback360Props = {
  id?: number;
  rateeId: number;
  rateeNote?: string | null;
  positionId: number;
  hrId: number;
  hrNote?: string | null;
  cycleId?: number | null;
  stage?: Feedback360Stage;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Feedback360Domain {
  readonly id?: number;
  readonly rateeId: number;
  readonly rateeNote?: string | null;
  readonly positionId: number;
  readonly hrId: number;
  readonly hrNote?: string | null;
  readonly cycleId?: number | null;
  readonly stage: Feedback360Stage;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: Feedback360Props) {
    this.id = props.id;
    this.rateeId = props.rateeId;
    this.rateeNote = props.rateeNote ?? null;
    this.positionId = props.positionId;
    this.hrId = props.hrId;
    this.hrNote = props.hrNote ?? null;
    this.cycleId = props.cycleId ?? null;
    this.stage = props.stage ?? Feedback360Stage.VERIFICATION_BY_HR;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Feedback360Props): Feedback360Domain {
    return new Feedback360Domain(props);
  }
}
