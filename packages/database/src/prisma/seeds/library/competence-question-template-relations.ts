import type { PrismaClient } from '@intra/database';

export default async function seedCompetenceQuestionTemplateRelations(
    prisma: PrismaClient,
) {
    const questionTemplates = await prisma.questionTemplate.findMany();

    for (const qt of questionTemplates) {
        await prisma.competenceQuestionTemplateRelation.upsert({
            where: {
                competenceId_questionTemplateId: {
                    competenceId: qt.competenceId,
                    questionTemplateId: qt.id,
                },
            },
            update: {},
            create: {
                competenceId: qt.competenceId,
                questionTemplateId: qt.id,
            },
        });
    }
}
