import { PrismaClient, AnswerType as PrismaAnswerType } from '@intra/database';
import { AnswerType } from '@intra/shared-kernel';
import type { CycleMap } from './cycles';
import { QUESTION_TEMPLATES_SEED_DATA } from '../library/question-templates';

export type QuestionMap = Map<string, { id: number }>;

export default async function seedQuestions(
    prisma: PrismaClient,
    cycleMap: CycleMap,
): Promise<QuestionMap> {
    const questionMap: QuestionMap = new Map();

    // Get all cycles
    const cycles = await prisma.cycle.findMany();

    if (cycles.length === 0) {
        console.warn('⚠️ No cycles found, skipping questions');
        return questionMap;
    }

    // Create questions from templates for each cycle
    for (const cycle of cycles) {
        for (const group of QUESTION_TEMPLATES_SEED_DATA) {
            const competence = await prisma.competence.findUnique({
                where: { code: group.competenceCode }
            });

            if (!competence) {
                console.warn(`⚠️ Competence ${group.competenceCode} not found, skipping questions`);
                continue;
            }

            for (const q of group.questions) {
                // Find the question template
                const questionTemplate = await prisma.questionTemplate.findFirst({
                    where: {
                        competenceId: competence.id,
                        title: q.title,
                    },
                });

                if (!questionTemplate) {
                    console.warn(`⚠️ Question template "${q.title}" not found`);
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
                            answerType: q.answerType.toString().toUpperCase() as unknown as PrismaAnswerType,
                            competenceId: competence.id,
                            isForSelfassessment: q.isForSelfassessment,
                        },
                    })
                    : await prisma.question.create({
                        data: {
                            cycleId: cycle.id,
                            questionTemplateId: questionTemplate.id,
                            title: q.title,
                            answerType: q.answerType.toString().toUpperCase() as unknown as PrismaAnswerType,
                            competenceId: competence.id,
                            isForSelfassessment: q.isForSelfassessment,
                        },
                    });

                const mapKey = `${cycle.title}:${group.competenceCode}:${q.title}`;
                questionMap.set(mapKey, { id: record.id });
            }
        }
    }

    return questionMap;
}
