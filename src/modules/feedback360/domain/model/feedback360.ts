export type Feedback360Stage =
  | 'CANCELED'
  | 'VERIFICATION_BY_HR'
  | 'VERIFICATION_BY_USER'
  | 'REJECTED'
  | 'SELF_ASSESSMENT'
  | 'WAITING_TO_START'
  | 'INPROGRESS'
  | 'RESEARCH'
  | 'FINISHED';

export type CreateFeedback360Data = {
  rateeId: number;
  rateeNote: string | null;
  positionId: number;
  hrId: number;
  hrNote: string | null;
  cycleId: number | null;
  stage: Feedback360Stage;
  reportId: number | null;
};

export type UpdateFeedback360Data = Partial<{
  rateeNote: string | null;
  hrNote: string | null;
  stage: Feedback360Stage;
}>;

export type Feedback360Props = {
  id: number;
  rateeId: number;
  rateeNote: string | null;
  positionId: number;
  hrId: number;
  hrNote: string | null;
  cycleId: number | null;
  stage: Feedback360Stage;
  reportId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Feedback360 {
  private props: Feedback360Props;

  private constructor(props: Feedback360Props) {
    Feedback360.assertProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get rateeId() {
    return this.props.rateeId;
  }
  get rateeNote() {
    return this.props.rateeNote;
  }
  get positionId() {
    return this.props.positionId;
  }
  get hrId() {
    return this.props.hrId;
  }
  get hrNote() {
    return this.props.hrNote;
  }
  get cycleId() {
    return this.props.cycleId;
  }
  get stage() {
    return this.props.stage;
  }
  get reportId() {
    return this.props.reportId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static fromPersistence(props: Feedback360Props): Feedback360 {
    return new Feedback360(props);
  }

  applyUpdate(patch: UpdateFeedback360Data): void {
    if (patch.rateeNote !== undefined) this.props.rateeNote = patch.rateeNote;
    if (patch.hrNote !== undefined) this.props.hrNote = patch.hrNote;
    if (patch.stage !== undefined) this.props.stage = patch.stage;
    Feedback360.assertProps(this.props);
  }

  toPrimitives(): Feedback360Props {
    return { ...this.props };
  }

  static defaultStage(): Feedback360Stage {
    return 'VERIFICATION_BY_HR';
  }

  private static assertProps(props: Feedback360Props) {
    if (!Number.isInteger(props.id) || props.id <= 0) throw new Error('Feedback360.id must be a positive integer');
    if (!Number.isInteger(props.rateeId) || props.rateeId <= 0) throw new Error('Feedback360.rateeId must be > 0');
    if (!Number.isInteger(props.positionId) || props.positionId <= 0)
      throw new Error('Feedback360.positionId must be > 0');
    if (!Number.isInteger(props.hrId) || props.hrId <= 0) throw new Error('Feedback360.hrId must be > 0');
    if (props.cycleId !== null && (!Number.isInteger(props.cycleId) || props.cycleId <= 0))
      throw new Error('Feedback360.cycleId must be null or > 0');
    if (props.reportId !== null && (!Number.isInteger(props.reportId) || props.reportId <= 0))
      throw new Error('Feedback360.reportId must be null or > 0');
    if (!props.createdAt || !(props.createdAt instanceof Date)) throw new Error('Feedback360.createdAt is required');
    if (!props.updatedAt || !(props.updatedAt instanceof Date)) throw new Error('Feedback360.updatedAt is required');
  }
}


