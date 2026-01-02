import { CycleStage } from '../enums/cycle-stage.enum';

export class Feedback360CycleDomain {
  readonly id?: number;
  readonly title: string;
  readonly description: string | null;
  readonly hrId: number;
  readonly stage: CycleStage;
  readonly isActive: boolean | null;
  readonly startDate: Date;
  readonly reviewDeadline: Date | null;
  readonly approvalDeadline: Date | null;
  readonly surveyDeadline: Date | null;
  readonly endDate: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: {
    id?: number;
    title: string;
    description: string | null;
    hrId: number;
    stage: CycleStage;
    isActive: boolean | null;
    startDate: Date;
    reviewDeadline: Date | null;
    approvalDeadline: Date | null;
    surveyDeadline: Date | null;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.hrId = props.hrId;
    this.stage = props.stage;
    this.isActive = props.isActive;
    this.startDate = props.startDate;
    this.reviewDeadline = props.reviewDeadline;
    this.approvalDeadline = props.approvalDeadline;
    this.surveyDeadline = props.surveyDeadline;
    this.endDate = props.endDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}


