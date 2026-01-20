import { ResponseStatus } from './enums/response-status.enum';
import { RespondentCategory } from './enums/respondent-category.enum';

export type RespondentProps = {
  id?: number;
  reviewId: number;
  respondentId: number;
  respondentCategory: RespondentCategory;
  responseStatus?: ResponseStatus;
  respondentNote?: string | null;
  invitedAt?: Date | null;
  respondedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class RespondentDomain {
  readonly id?: number;
  readonly reviewId: number;
  readonly respondentId: number;
  readonly respondentCategory: RespondentCategory;
  readonly responseStatus: ResponseStatus;
  readonly respondentNote?: string | null;
  readonly invitedAt?: Date | null;
  readonly respondedAt?: Date | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: RespondentProps) {
    this.id = props.id;
    this.reviewId = props.reviewId;
    this.respondentId = props.respondentId;
    this.respondentCategory = props.respondentCategory;
    this.responseStatus = props.responseStatus ?? ResponseStatus.PENDING;
    this.respondentNote = props.respondentNote ?? null;
    this.invitedAt = props.invitedAt ?? null;
    this.respondedAt = props.respondedAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: RespondentProps): RespondentDomain {
    return new RespondentDomain(props);
  }
}
