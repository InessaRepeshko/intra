import type {
    ReviewQuestionRelationResponseDto,
    ReviewStage,
} from '@entities/feedback360/survey/model/types';

export interface SurveyQuestion extends Omit<
    ReviewQuestionRelationResponseDto,
    'createdAt' | 'isForSelfassessment'
> {
    createdAt: Date;
    isForSelfassessment: boolean;
}

export function mapSurveyQuestionDtoToModel(
    dto: ReviewQuestionRelationResponseDto,
): SurveyQuestion {
    const isForSelfassessment =
        typeof dto.isForSelfassessment === 'string'
            ? dto.isForSelfassessment === 'true'
            : Boolean(dto.isForSelfassessment);

    return {
        ...dto,
        isForSelfassessment,
        createdAt: new Date(dto.createdAt),
    };
}

export type SurveyDataProps = {
    reviewId: number;
    rateeFullName: string;
    stage: ReviewStage;
    cycleId: number | null;
    cycleTitle: string | null;
    teamId: number | null;
    teamTitle: string | null;
    positionId: number | null;
    positionTitle: string | null;
    competenceCount: number;
    questionCount: number;
    numericalQuestionCount: number;
    textQuestionCount: number;
    createdAt: Date;
};

export class SurveyData {
    readonly reviewId: number;
    readonly rateeFullName: string;
    readonly stage: ReviewStage;
    readonly cycleId: number | null;
    readonly cycleTitle: string | null;
    readonly teamId: number | null;
    readonly teamTitle: string | null;
    readonly positionId: number | null;
    readonly positionTitle: string | null;
    readonly competenceCount: number;
    readonly questionCount: number;
    readonly numericalQuestionCount: number;
    readonly textQuestionCount: number;
    readonly createdAt: Date;

    private constructor(props: SurveyDataProps) {
        this.reviewId = props.reviewId;
        this.rateeFullName = props.rateeFullName;
        this.stage = props.stage;
        this.cycleId = props.cycleId ?? null;
        this.cycleTitle = props.cycleTitle ?? null;
        this.teamId = props.teamId ?? null;
        this.teamTitle = props.teamTitle ?? null;
        this.positionId = props.positionId ?? null;
        this.positionTitle = props.positionTitle ?? null;
        this.competenceCount = props.competenceCount;
        this.questionCount = props.questionCount;
        this.numericalQuestionCount = props.numericalQuestionCount;
        this.textQuestionCount = props.textQuestionCount;
        this.createdAt = props.createdAt;
    }

    static create(props: SurveyDataProps): SurveyData {
        return new SurveyData(props);
    }
}
