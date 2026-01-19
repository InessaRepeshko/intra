import { CycleStage } from './enum/cycle-stage.enum';

export type Feedback360CycleProps = {
  id?: number;
  title: string;
  description?: string | null;
  hrId: number;
  stage?: CycleStage;
  isActive?: boolean | null;
  startDate: Date;
  reviewDeadline?: Date | null;
  approvalDeadline?: Date | null;
  surveyDeadline?: Date | null;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Feedback360CycleDomain {
  readonly id?: number;
  readonly title: string;
  readonly description?: string | null;
  readonly hrId: number;
  readonly stage: CycleStage;
  readonly isActive: boolean;
  readonly startDate: Date;
  readonly reviewDeadline?: Date | null;
  readonly approvalDeadline?: Date | null;
  readonly surveyDeadline?: Date | null;
  readonly endDate: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: Feedback360CycleProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description ?? null;
    this.hrId = props.hrId;
    this.stage = props.stage ?? CycleStage.NEW;
    this.isActive = props.isActive ?? true;
    this.startDate = props.startDate;
    this.reviewDeadline = props.reviewDeadline ?? null;
    this.approvalDeadline = props.approvalDeadline ?? null;
    this.surveyDeadline = props.surveyDeadline ?? null;
    this.endDate = props.endDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Feedback360CycleProps): Feedback360CycleDomain {
    return new Feedback360CycleDomain(props);
  }
}
