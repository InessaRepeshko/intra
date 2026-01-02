import { Feedback360Status } from '../enums/feedback360-status.enum';
import { RespondentCategory } from '../enums/respondent-category.enum';

export class Feedback360RespondentRelationDomain {
  readonly id?: number;
  readonly feedback360Id: number;
  readonly respondentId: number;
  readonly respondentCategory: RespondentCategory;
  readonly feedback360Status: Feedback360Status;
  readonly respondentNote: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: {
    id?: number;
    feedback360Id: number;
    respondentId: number;
    respondentCategory: RespondentCategory;
    feedback360Status: Feedback360Status;
    respondentNote: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.feedback360Id = props.feedback360Id;
    this.respondentId = props.respondentId;
    this.respondentCategory = props.respondentCategory;
    this.feedback360Status = props.feedback360Status;
    this.respondentNote = props.respondentNote;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}


