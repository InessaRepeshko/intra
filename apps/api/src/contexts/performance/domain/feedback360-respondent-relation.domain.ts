import { Feedback360Status } from './enum/feedback360-status.enum';
import { RespondentCategory } from './enum/respondent-category.enum';

export type Feedback360RespondentRelationProps = {
  id?: number;
  feedback360Id: number;
  respondentId: number;
  respondentCategory: RespondentCategory;
  feedback360Status?: Feedback360Status;
  respondentNote?: string | null;
  invitedAt?: Date | null;
  respondedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Feedback360RespondentRelationDomain {
  readonly id?: number;
  readonly feedback360Id: number;
  readonly respondentId: number;
  readonly respondentCategory: RespondentCategory;
  readonly feedback360Status: Feedback360Status;
  readonly respondentNote?: string | null;
  readonly invitedAt?: Date | null;
  readonly respondedAt?: Date | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: Feedback360RespondentRelationProps) {
    this.id = props.id;
    this.feedback360Id = props.feedback360Id;
    this.respondentId = props.respondentId;
    this.respondentCategory = props.respondentCategory;
    this.feedback360Status = props.feedback360Status ?? Feedback360Status.PENDING;
    this.respondentNote = props.respondentNote ?? null;
    this.invitedAt = props.invitedAt ?? null;
    this.respondedAt = props.respondedAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Feedback360RespondentRelationProps): Feedback360RespondentRelationDomain {
    return new Feedback360RespondentRelationDomain(props);
  }
}
