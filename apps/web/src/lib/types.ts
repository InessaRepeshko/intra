// =================== ENUMS ===================

export enum IdentityRole {
    ADMIN = 'ADMIN',
    HR = 'HR',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
}

export enum IdentityStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum CycleStage {
    NEW = 'NEW',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
<<<<<<< HEAD
    PREPARING_REPORT = 'PREPARING_REPORT',
    PUBLISHED = 'PUBLISHED',
    CANCELED = 'CANCELED',
    ARCHIVED = 'ARCHIVED',
}

export enum ReviewStage {
    NEW = 'NEW',
    SELF_ASSESSMENT = 'SELF_ASSESSMENT',
    WAITING_TO_START = 'WAITING_TO_START',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    PREPARING_REPORT = 'PREPARING_REPORT',
    PROCESSING_BY_HR = 'PROCESSING_BY_HR',
    PUBLISHED = 'PUBLISHED',
    ANALYSIS = 'ANALYSIS',
    CANCELED = 'CANCELED',
    ARCHIVED = 'ARCHIVED',
=======
}

export enum ReviewStage {
    DRAFT = 'DRAFT',
    VERIFICATION_BY_HR = 'VERIFICATION_BY_HR',
    COLLECTING_RESPONSES = 'COLLECTING_RESPONSES',
    PREPARING_REPORT = 'PREPARING_REPORT',
    REPORT_READY = 'REPORT_READY',
>>>>>>> main
}

export enum RespondentCategory {
    SELF = 'SELF',
    TEAM = 'TEAM',
    OTHER = 'OTHER',
}

export enum ResponseStatus {
    PENDING = 'PENDING',
    RESPONDED = 'RESPONDED',
    CANCELED = 'CANCELED',
}

export enum AnswerType {
    NUMERICAL_SCALE = 'NUMERICAL_SCALE',
    TEXT_FIELD = 'TEXT_FIELD',
}

export enum QuestionTemplateStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
}

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

// =================== INTERFACES ===================

export interface User {
    id: number;
    firstName: string;
    secondName?: string;
    lastName: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    status: IdentityStatus;
    positionId?: number | null;
    positionTitle?: string;
    teamId?: number | null;
    teamTitle?: string;
    managerId?: number | null;
    managerFullName?: string;
    roles: IdentityRole[];
    createdAt: string;
    updatedAt: string;
}

export interface Cycle {
    id: number;
    title: string;
    description?: string;
    hrId: number;
    hrFullName?: string;
    stage: CycleStage;
    isActive: boolean;
    minRespondentsThreshold?: number;
    startDate: string;
    endDate: string;
    reviewDeadline?: string;
    approvalDeadline?: string;
    responseDeadline?: string;
    reviewsCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: number;
    rateeId: number;
    rateeFullName: string;
    rateePositionId: number;
    rateePositionTitle: string;
    hrId: number;
    hrFullName: string;
    hrNote?: string;
    teamId?: number | null;
    teamTitle?: string | null;
    managerId?: number | null;
    managerFullName?: string | null;
    managerPositionId?: number | null;
    managerPositionTitle?: string | null;
    cycleId?: number | null;
    cycleTitle?: string;
    stage: ReviewStage;
    reportId?: number | null;
    respondentsCount?: number;
    respondedCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Respondent {
    id: number;
    reviewId: number;
    respondentId: number;
    fullName: string;
    category: RespondentCategory;
    responseStatus: ResponseStatus;
    respondentNote?: string;
    hrNote?: string;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
    invitedAt?: string;
    canceledAt?: string;
    respondedAt?: string;
}

export interface Reviewer {
    id: number;
    reviewId: number;
    reviewerId: number;
    fullName: string;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
}

export interface Question {
    id: number;
    cycleId?: number;
    questionTemplateId?: number;
    title: string;
    answerType: AnswerType;
    competenceId?: number;
    competenceTitle?: string;
    isForSelfassessment?: boolean;
}

export interface Answer {
    id: number;
    reviewId: number;
    questionId: number;
    questionTitle?: string;
    respondentCategory: RespondentCategory;
    answerType: AnswerType;
    numericalValue?: number;
    textValue?: string;
    createdAt: string;
}

export interface QuestionTemplate {
    id: number;
    competenceId: number;
    competenceTitle?: string;
    title: string;
    answerType: AnswerType;
    isForSelfassessment: boolean;
    status: QuestionTemplateStatus;
    positionIds?: number[];
    positionTitles?: string[];
}

export interface Competence {
    id: number;
    code?: string | null;
    title: string;
    description?: string | null;
    questionsCount?: number;
}

export interface Cluster {
    id: number;
    competenceId: number;
    competenceTitle?: string;
    lowerBound: number;
    upperBound: number;
    title: string;
    description: string;
}

export interface Team {
    id: number;
    title: string;
    description?: string | null;
    headId?: number | null;
    headFullName?: string;
    membersCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Position {
    id: number;
    title: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Report {
    id: number;
    reviewId: number;
    rateeFullName: string;
    cycleTitle?: string;
    respondentsCount: number;
    turnoutTeam: number;
    turnoutOther: number;
    createdAt: string;
}

// =================== PAGINATED RESPONSE ===================

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// =================== AUTH CONTEXT ===================

export interface AuthUser {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    roles: IdentityRole[];
    positionTitle?: string;
    teamTitle?: string;
}
