import { AnswerType as PrismaAnswerType } from '@intra/database';

export const COMPETENCES_SEED_DATA = [
    {
        code: 'LEAD',
        title: 'Leadership',
        description: 'Ability to lead and inspire others to achieve common goals.',
        questions: [
            {
                title: 'Demonstrates clear vision and direction for the team.',
                answerType: PrismaAnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Provides constructive feedback and coaching.',
                answerType: PrismaAnswerType.TEXT_FIELD,
                isForSelfassessment: false,
            },
        ],
    },
    {
        code: 'COMM',
        title: 'Communication',
        description: 'Effective transfer of information and understanding.',
        questions: [
            {
                title: 'Listens actively and empathetically.',
                answerType: PrismaAnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Communicates complex ideas clearly.',
                answerType: PrismaAnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
        ],
    },
    {
        code: 'TECH',
        title: 'Technical Excellence',
        description: 'Mastery of technical skills and continuous learning.',
        questions: [
            {
                title: 'Produces high-quality, maintainable code.',
                answerType: PrismaAnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
            {
                title: 'Stays updated with latest industry trends.',
                answerType: PrismaAnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
            },
        ],
    },
];
