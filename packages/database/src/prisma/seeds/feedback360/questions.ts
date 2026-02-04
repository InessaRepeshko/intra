import { AnswerType as PrismaAnswerType, PrismaClient } from '@intra/database';
import type { CycleMap } from './cycles';

export type QuestionMap = Map<string, { id: number }>;

type SurveyQuestion = {
    competenceCode: string;
    title: string;
    answerType: PrismaAnswerType;
    isForSelfassessment: boolean;
};

const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        competenceCode: 'LEAD',
        title: 'Sets a clear vision aligned with company strategy.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'LEAD',
        title: 'Makes decisive calls when information is incomplete.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'COMM',
        title: 'Tailors messaging to different audiences.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'COMM',
        title: 'Keeps stakeholders informed on progress and risks.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'TECH',
        title: 'Produces maintainable code that follows standards.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'TECH',
        title: 'Designs systems with scalability in mind.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'QUAL',
        title: 'Defines clear acceptance criteria before starting work.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'QUAL',
        title: 'Adds automated tests for critical paths.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'COLLAB',
        title: 'Shares context proactively with peers.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'COLLAB',
        title: 'Seeks input from relevant experts before committing.',
        answerType: PrismaAnswerType.NUMERICAL_SCALE,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'LEAD',
        title: 'Builds trust through transparent decisions.',
        answerType: PrismaAnswerType.TEXT_FIELD,
        isForSelfassessment: false,
    },
    {
        competenceCode: 'COMM',
        title: 'Gives direct feedback with empathy.',
        answerType: PrismaAnswerType.TEXT_FIELD,
        isForSelfassessment: false,
    },
];

export default async function seedQuestions(
    prisma: PrismaClient,
    _cycleMap: CycleMap,
): Promise<QuestionMap> {
    const questionMap: QuestionMap = new Map();

    const cycles = await prisma.cycle.findMany();

    if (cycles.length === 0) {
        console.warn('⚠️ No cycles found, skipping questions');
        return questionMap;
    }

    for (const cycle of cycles) {
        for (const q of SURVEY_QUESTIONS) {
            const competence = await prisma.competence.findUnique({
                where: { code: q.competenceCode },
            });

            if (!competence) {
                console.warn(
                    `⚠️ Competence ${q.competenceCode} not found, skipping "${q.title}"`,
                );
                continue;
            }

            const questionTemplate = await prisma.questionTemplate.findFirst({
                where: {
                    competenceId: competence.id,
                    title: q.title,
                },
            });

            if (!questionTemplate) {
                console.warn(
                    `⚠️ Question template "${q.title}" not found`,
                );
                continue;
            }

            const existing = await prisma.question.findFirst({
                where: {
                    cycleId: cycle.id,
                    questionTemplateId: questionTemplate.id,
                    title: q.title,
                },
            });

            const record = existing
                ? await prisma.question.update({
                      where: { id: existing.id },
                      data: {
                          cycleId: cycle.id,
                          questionTemplateId: questionTemplate.id,
                          title: q.title,
                          answerType: q.answerType,
                          competenceId: competence.id,
                          isForSelfassessment: q.isForSelfassessment,
                      },
                  })
                : await prisma.question.create({
                      data: {
                          cycleId: cycle.id,
                          questionTemplateId: questionTemplate.id,
                          title: q.title,
                          answerType: q.answerType,
                          competenceId: competence.id,
                          isForSelfassessment: q.isForSelfassessment,
                      },
                  });

            const mapKey = `${cycle.title}:${q.title}`;
            questionMap.set(mapKey, { id: record.id });
        }
    }

    return questionMap;
}
