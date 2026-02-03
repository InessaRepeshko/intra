import {
    type PrismaClient,
    AnswerType as PrismaAnswerType,
    QuestionTemplateStatus as PrismaQuestionTemplateStatus,
} from '@intra/database';
import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';

export type QuestionTemplateMap = Map<string, { id: number }>;

export const QUESTION_TEMPLATES_SEED_DATA = [
    {
        competenceCode: 'LEAD',
        questions: [
            {
                title: 'Sets a clear vision aligned with company strategy.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Makes decisive calls when information is incomplete.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Builds trust through transparent decisions.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Acts as a role model for company values.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
            },
            {
                title: 'Handles conflicts calmly and fairly.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Delegates effectively while staying accountable.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
        ],
    },
    {
        competenceCode: 'COMM',
        questions: [
            {
                title: 'Tailors messaging to different audiences.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Keeps stakeholders informed on progress and risks.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Gives direct feedback with empathy.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Listens actively before responding.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Can simplify complex topics for non-experts.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
            },
            {
                title: 'Writes concise updates with clear next steps.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: true,
            },
        ],
    },
    {
        competenceCode: 'TECH',
        questions: [
            {
                title: 'Produces maintainable code that follows standards.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Designs systems with scalability in mind.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Reviews code thoroughly and constructively.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Debugs production issues systematically.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Automates repetitive tasks where feasible.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Keeps dependencies and tooling up to date.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Understands trade-offs of architectural decisions.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Designs reliable APIs with clear contracts.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
            },
        ],
    },
    {
        competenceCode: 'PMGT',
        questions: [
            {
                title: 'Sets clear goals and expectations for team members.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Provides timely coaching and recognition.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Supports career growth with actionable plans.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Balances workload to avoid burnout.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Addresses performance issues promptly.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
        ],
    },
    {
        competenceCode: 'DELIV',
        questions: [
            {
                title: 'Breaks work into milestones with realistic estimates.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Keeps delivery risks visible and mitigated.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Runs efficient planning and retrospectives.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Measures outcomes, not just output.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Aligns priorities with business impact.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Continuously improves team workflows.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
        ],
    },
    {
        competenceCode: 'QUAL',
        questions: [
            {
                title: 'Defines clear acceptance criteria before starting work.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Adds automated tests for critical paths.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Prevents regressions through proactive checks.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Escalates quality risks early.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Validates data integrity and edge cases.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
            },
        ],
    },
    {
        competenceCode: 'PROD',
        questions: [
            {
                title: 'Translates user problems into actionable hypotheses.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: true,
            },
            {
                title: 'Uses data and research to prioritize features.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Designs solutions that balance usability and feasibility.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Tests concepts with users before scaling.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Creates clear handoffs between design and engineering.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: true,
            },
        ],
    },
    {
        competenceCode: 'CUST',
        questions: [
            {
                title: 'Advocates for customer needs in decision making.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Responds to customer feedback with concrete actions.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Understands impact of changes on clients workflows.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Builds relationships that increase customer loyalty.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
        ],
    },
    {
        competenceCode: 'COLLAB',
        questions: [
            {
                title: 'Shares context proactively with peers.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Seeks input from relevant experts before committing.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Resolves misalignment respectfully and quickly.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Celebrates team wins and recognizes contributions.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: true,
            },
        ],
    },
    {
        competenceCode: 'STRAT',
        questions: [
            {
                title: 'Connects day-to-day work to long-term strategy.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Spots market or tech shifts early and acts on them.',
                answerType: AnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
            {
                title: 'Challenges assumptions with data and experiments.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Allocates resources to the highest-leverage bets.',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: false,
            },
        ],
    },
];

export default async function seedQuestionTemplates(
    prisma: PrismaClient,
): Promise<QuestionTemplateMap> {
    const questionTemplateMap: QuestionTemplateMap = new Map();

    for (const group of QUESTION_TEMPLATES_SEED_DATA) {
        const competence = await prisma.competence.findUnique({
            where: { code: group.competenceCode },
        });
        if (!competence) {
            console.warn(
                `⚠️ Competence ${group.competenceCode} not found, skipping its questions`,
            );
            continue;
        }

        for (const q of group.questions) {
            const existingQuestion = await prisma.questionTemplate.findFirst({
                where: {
                    competenceId: competence.id,
                    title: q.title,
                },
            });

            const record = existingQuestion
                ? await prisma.questionTemplate.update({
                      where: { id: existingQuestion.id },
                      data: {
                          competenceId: competence.id,
                          title: q.title,
                          answerType: q.answerType
                              .toString()
                              .toUpperCase() as unknown as PrismaAnswerType,
                          isForSelfassessment: q.isForSelfassessment,
                          status: QuestionTemplateStatus.ACTIVE.toString().toUpperCase() as unknown as PrismaQuestionTemplateStatus,
                      },
                  })
                : await prisma.questionTemplate.create({
                      data: {
                          competenceId: competence.id,
                          title: q.title,
                          answerType: q.answerType
                              .toString()
                              .toUpperCase() as unknown as PrismaAnswerType,
                          isForSelfassessment: q.isForSelfassessment,
                          status: QuestionTemplateStatus.ACTIVE.toString().toUpperCase() as unknown as PrismaQuestionTemplateStatus,
                      },
                  });

            questionTemplateMap.set(q.title, { id: record.id });
        }
    }

    return questionTemplateMap;
}
