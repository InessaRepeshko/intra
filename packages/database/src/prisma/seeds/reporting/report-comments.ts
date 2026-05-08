import {
    PrismaClient,
    CommentSentiment as PrismaCommentSentiment,
    RespondentCategory as PrismaRespondentCategory,
} from '@intra/database';

const POSITIVE_COMMENTS = new Set<string>([
    'Demonstrates excellent technical skills and attention to detail',
    'Great team player, always willing to help colleagues',
    'Shows strong initiative in taking on challenging tasks',
    'Communicates clearly and effectively with stakeholders',
    'Consistently delivers high-quality work on time',
    'Brings creative solutions to complex problems',
    'Excellent at mentoring junior team members',
    'Proactive in identifying and addressing potential issues',
    'Strong collaboration skills across teams',
    'Takes ownership of assigned tasks and follows through',
]);

const NEGATIVE_COMMENTS = new Set<string>([
    'Could improve time estimation for complex tasks',
    'Would benefit from more proactive communication during blockers',
    'Sometimes takes on too much work simultaneously',
    'Could delegate more effectively to team members',
    'Would benefit from deeper dive into system architecture',
    'Could improve documentation practices',
    'Sometimes misses edge cases in testing',
    'Would benefit from more cross-team collaboration',
]);

const NUMBERS_OF_MENTIONS = [1, 2, 3, 4, 5];

function detectSentiment(comment: string): PrismaCommentSentiment {
    if (NEGATIVE_COMMENTS.has(comment)) return PrismaCommentSentiment.NEGATIVE;
    if (POSITIVE_COMMENTS.has(comment)) return PrismaCommentSentiment.POSITIVE;
    return PrismaCommentSentiment.POSITIVE;
}

function pickRandomNumberOfMentions(): number {
    return NUMBERS_OF_MENTIONS[
        Math.floor(Math.random() * NUMBERS_OF_MENTIONS.length)
    ];
}

type CommentBucket = {
    questionId: number;
    questionTitle: string;
    comment: string;
    respondentCategories: Set<PrismaRespondentCategory>;
    numberOfMentions: number;
};

export default async function seedReportComments(prisma: PrismaClient) {
    const reports = await prisma.report.findMany({
        select: { id: true, reviewId: true },
    });

    if (reports.length === 0) {
        console.info(
            '   ⚠️  No reports found — skipping report comments seeding',
        );
        return;
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const report of reports) {
        const textAnswers = await prisma.answer.findMany({
            where: {
                reviewId: report.reviewId,
                answerType: 'TEXT_FIELD',
                textValue: { not: null },
            },
            include: {
                question: { select: { id: true, title: true } },
            },
        });

        if (textAnswers.length === 0) continue;

        const buckets = new Map<string, CommentBucket>();

        for (const answer of textAnswers) {
            if (!answer.textValue || !answer.question) continue;

            const trimmed = answer.textValue.trim();
            if (trimmed.length === 0) continue;

            const key = `${answer.question.id}::${trimmed}`;
            const bucket = buckets.get(key);

            if (bucket) {
                bucket.respondentCategories.add(answer.respondentCategory);
            } else {
                buckets.set(key, {
                    questionId: answer.question.id,
                    questionTitle: answer.question.title,
                    comment: trimmed,
                    respondentCategories: new Set([answer.respondentCategory]),
                    numberOfMentions: pickRandomNumberOfMentions(),
                });
            }
        }

        for (const bucket of buckets.values()) {
            const existing = await prisma.reportComment.findFirst({
                where: {
                    reportId: report.id,
                    questionId: bucket.questionId,
                    comment: bucket.comment,
                },
                select: { id: true },
            });

            if (existing) {
                skippedCount += 1;
                continue;
            }

            await prisma.reportComment.create({
                data: {
                    reportId: report.id,
                    questionId: bucket.questionId,
                    questionTitle: bucket.questionTitle,
                    comment: bucket.comment,
                    respondentCategories: Array.from(
                        bucket.respondentCategories,
                    ),
                    commentSentiment: detectSentiment(bucket.comment),
                    numberOfMentions: bucket.numberOfMentions,
                },
            });
            createdCount += 1;
        }
    }

    console.info(
        `   📝 Report comments — created: ${createdCount}, skipped: ${skippedCount}`,
    );
}
