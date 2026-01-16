import { type PrismaClient, QuestionStatus } from '@intra/database';
import { COMPETENCES_SEED_DATA } from './data';

export async function seedQuestions(prisma: PrismaClient) {
    console.log('❓ Seeding questions...');
    for (const c of COMPETENCES_SEED_DATA) {
        const competence = await prisma.competence.findUnique({ where: { title: c.title } });
        if (!competence) continue;

        for (const q of c.questions) {
            const existingQuestion = await prisma.question.findFirst({
                where: {
                    competenceId: competence.id,
                    title: q.title,
                },
            });

            if (!existingQuestion) {
                await prisma.question.create({
                    data: {
                        competenceId: competence.id,
                        title: q.title,
                        answerType: q.answerType as any,
                        isForSelfassessment: q.isForSelfassessment,
                        questionStatus: QuestionStatus.ACTIVE,
                    },
                });
            }
        }
    }
}
