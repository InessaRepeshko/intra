import {
    AnswerType as PrismaAnswerType,
    PrismaClient,
    RespondentCategory as PrismaRespondentCategory,
} from '@intra/database';
import type { ReviewMap } from './reviews';

// Sample text feedback comments for Ukrainian company context
const POSITIVE_COMMENTS = [
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
];

const CONSTRUCTIVE_COMMENTS = [
    'Could improve time estimation for complex tasks',
    'Would benefit from more proactive communication during blockers',
    'Sometimes takes on too much work simultaneously',
    'Could delegate more effectively to team members',
    'Would benefit from deeper dive into system architecture',
    'Could improve documentation practices',
    'Sometimes misses edge cases in testing',
    'Would benefit from more cross-team collaboration',
];

function getRandomComment(isPositive: boolean): string {
    const comments = isPositive ? POSITIVE_COMMENTS : CONSTRUCTIVE_COMMENTS;
    return comments[Math.floor(Math.random() * comments.length)];
}

function getRandomScore(isHighPerformer: boolean, isCritical: boolean): number {
    // High performers: 4-5 for critical, 3-5 for others
    // Regular: 3-4 for critical, 2-4 for others
    if (isHighPerformer) {
        return isCritical
            ? Math.floor(Math.random() * 2) + 4 // 4-5
            : Math.floor(Math.random() * 3) + 3; // 3-5
    } else {
        return isCritical
            ? Math.floor(Math.random() * 2) + 3 // 3-4
            : Math.floor(Math.random() * 3) + 2; // 2-4
    }
}

// Determine if employee is high performer based on position
function isHighPerformer(positionTitle: string): boolean {
    return (
        positionTitle.includes('Senior') ||
        positionTitle.includes('Lead') ||
        positionTitle.includes('Director')
    );
}

// Determine if competence is critical for position
function isCriticalCompetence(
    competenceCode: string,
    positionTitle: string,
): boolean {
    if (
        positionTitle.includes('Software Engineer') ||
        positionTitle.includes('Tech Lead')
    ) {
        return ['TECH', 'DELIV', 'QUAL', 'COLLAB'].includes(competenceCode);
    }
    if (positionTitle.includes('QA Engineer')) {
        return ['QUAL', 'TECH', 'DELIV', 'COLLAB'].includes(competenceCode);
    }
    if (positionTitle.includes('Designer')) {
        return ['PROD', 'COMM', 'CUST', 'COLLAB'].includes(competenceCode);
    }
    if (positionTitle.includes('Lead') || positionTitle.includes('Director')) {
        return ['LEAD', 'PMGT', 'COMM', 'STRAT'].includes(competenceCode);
    }
    return false;
}

export default async function seedAnswers(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
) {
    // Get all reviews with respondents
    const reviews = await prisma.review.findMany({
        include: {
            respondents: {
                where: {
                    responseStatus: 'COMPLETED', // Only completed responses
                },
            },
            reviewQuestionRelations: {
                include: {
                    question: {
                        include: {
                            competence: true,
                        },
                    },
                    competence: true,
                },
            },
            ratee: true,
            position: true,
        },
    });

    for (const review of reviews) {
        const isHighPerf = isHighPerformer(review.rateePositionTitle);

        // For each respondent who completed the review
        for (const respondent of review.respondents) {
            // Answer each question in the review
            for (const rqr of review.reviewQuestionRelations) {
                const question = rqr.question;

                // Skip if this is a self-assessment question but respondent is not self
                if (
                    question.isForSelfassessment &&
                    respondent.category !== 'SELF_ASSESSMENT'
                ) {
                    continue;
                }

                // Skip if this is not for self-assessment but respondent is self
                if (
                    !question.isForSelfassessment &&
                    respondent.category === 'SELF_ASSESSMENT'
                ) {
                    continue;
                }

                const existing = await prisma.answer.findFirst({
                    where: {
                        reviewId: review.id,
                        questionId: question.id,
                        respondentCategory: respondent.category,
                    },
                });

                if (existing) continue;

                const competenceCode = question.competence?.code ?? '';
                const isCritical = isCriticalCompetence(
                    competenceCode,
                    review.rateePositionTitle,
                );

                // Create answer based on question type
                if (question.answerType === 'NUMERICAL_SCALE') {
                    const score = getRandomScore(isHighPerf, isCritical);

                    await prisma.answer.create({
                        data: {
                            reviewId: review.id,
                            questionId: question.id,
                            respondentCategory:
                                respondent.category as unknown as PrismaRespondentCategory,
                            answerType:
                                'NUMERICAL_SCALE' as unknown as PrismaAnswerType,
                            numericalValue: score,
                            textValue: null,
                        },
                    });
                } else if (question.answerType === 'TEXT_FIELD') {
                    // 70% chance of providing text feedback for TEXT_FIELD questions
                    const shouldProvideComment = Math.random() < 0.7;

                    if (shouldProvideComment) {
                        const isPositiveFeedback = Math.random() < 0.75; // 75% positive
                        const comment = getRandomComment(isPositiveFeedback);

                        await prisma.answer.create({
                            data: {
                                reviewId: review.id,
                                questionId: question.id,
                                respondentCategory:
                                    respondent.category as unknown as PrismaRespondentCategory,
                                answerType:
                                    'TEXT_FIELD' as unknown as PrismaAnswerType,
                                numericalValue: null,
                                textValue: comment,
                            },
                        });
                    }
                }
            }
        }
    }
}
