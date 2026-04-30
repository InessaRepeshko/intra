'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import { cn } from '@shared/lib/utils/cn';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';

const likertScale = [
    { value: '0', label: 'N/A', description: 'Not applicable' },
    { value: '1', label: '1', description: 'Strongly Disagree' },
    { value: '2', label: '2', description: 'Disagree' },
    { value: '3', label: '3', description: 'Neutral' },
    { value: '4', label: '4', description: 'Agree' },
    { value: '5', label: '5', description: 'Strongly Agree' },
];

export interface Competency {
    id: string;
    name: string;
    description: string;
}

export interface Question {
    id: string;
    text: string;
    competencyId: string;
    type: 'likert' | 'open-ended';
}

// Mock Data
export const competencies: Competency[] = [
    {
        id: 'c1',
        name: 'Communication',
        description: 'Ability to convey ideas clearly and effectively',
    },
    {
        id: 'c2',
        name: 'Leadership',
        description: 'Ability to guide and inspire team members',
    },
    {
        id: 'c3',
        name: 'Problem Solving',
        description: 'Analytical thinking and creative solutions',
    },
    {
        id: 'c4',
        name: 'Teamwork',
        description: 'Collaboration and supporting colleagues',
    },
    {
        id: 'c5',
        name: 'Technical Skills',
        description: 'Proficiency in job-related technical abilities',
    },
    {
        id: 'c6',
        name: 'Adaptability',
        description: 'Flexibility and openness to change',
    },
];

export const questions: Question[] = [
    // Communication
    {
        id: 'q1',
        text: 'Communicates ideas clearly and concisely in meetings',
        competencyId: 'c1',
        type: 'likert',
    },
    {
        id: 'q2',
        text: 'Listens actively and responds thoughtfully to others',
        competencyId: 'c1',
        type: 'likert',
    },
    // Leadership
    {
        id: 'q3',
        text: 'Takes initiative and ownership of projects',
        competencyId: 'c2',
        type: 'likert',
    },
    {
        id: 'q4',
        text: 'Provides constructive feedback and guidance to others',
        competencyId: 'c2',
        type: 'likert',
    },
    // Problem Solving
    {
        id: 'q5',
        text: 'Analyzes complex problems and identifies root causes',
        competencyId: 'c3',
        type: 'likert',
    },
    {
        id: 'q6',
        text: 'Proposes innovative solutions to challenges',
        competencyId: 'c3',
        type: 'likert',
    },
    // Teamwork
    {
        id: 'q7',
        text: 'Collaborates effectively with team members',
        competencyId: 'c4',
        type: 'likert',
    },
    {
        id: 'q8',
        text: 'Supports colleagues and shares knowledge willingly',
        competencyId: 'c4',
        type: 'likert',
    },
    // Technical Skills
    {
        id: 'q9',
        text: 'Demonstrates strong technical expertise in their domain',
        competencyId: 'c5',
        type: 'likert',
    },
    {
        id: 'q10',
        text: 'Stays current with industry trends and best practices',
        competencyId: 'c5',
        type: 'likert',
    },
    // Adaptability
    {
        id: 'q11',
        text: 'Adapts quickly to new situations and requirements',
        competencyId: 'c6',
        type: 'likert',
    },
    {
        id: 'q12',
        text: 'Remains effective under pressure and during change',
        competencyId: 'c6',
        type: 'likert',
    },
];

export const openEndedQuestions = [
    {
        id: 'oe1',
        text: "What are this person's key strengths that you have observed?",
        type: 'open-ended' as const,
    },
    {
        id: 'oe2',
        text: 'What areas would you recommend for development or improvement?',
        type: 'open-ended' as const,
    },
];

export default function SurveyFormPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const surveyType = searchParams.get('type') || 'peer';
    const isSelfAssessment = surveyType === 'self';

    const [responses, setResponses] = useState<Record<string, string>>({});
    const [openEndedResponses, setOpenEndedResponses] = useState<
        Record<string, string>
    >({});
    const [draftSaved, setDraftSaved] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save draft
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                Object.keys(responses).length > 0 ||
                Object.keys(openEndedResponses).length > 0
            ) {
                setDraftSaved(true);
                setLastSaved(new Date());
                // In real app, this would save to backend
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [responses, openEndedResponses]);

    const handleLikertChange = (questionId: string, value: string) => {
        setResponses((prev) => ({ ...prev, [questionId]: value }));
        setDraftSaved(false);
    };

    const handleOpenEndedChange = (questionId: string, value: string) => {
        setOpenEndedResponses((prev) => ({ ...prev, [questionId]: value }));
        setDraftSaved(false);
    };

    const handleSubmit = () => {
        // In real app, submit to backend
        router.push('/surveys');
    };

    // Group questions by competency
    const questionsByCompetency = competencies.map((comp) => ({
        ...comp,
        questions: questions.filter((q) => q.competencyId === comp.id),
    }));

    const completedQuestions = Object.keys(responses).length;
    const totalQuestions = questions.length;
    const progress = Math.round((completedQuestions / totalQuestions) * 100);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/surveys">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-semibold text-foreground">
                                    {isSelfAssessment
                                        ? 'Self-Assessment'
                                        : 'Peer Review'}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={
                                        isSelfAssessment
                                            ? 'border-chart-2/50 bg-chart-2/10 text-chart-2'
                                            : 'border-chart-1/50 bg-chart-1/10 text-chart-1'
                                    }
                                >
                                    {isSelfAssessment ? 'Self' : 'Peer'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {isSelfAssessment
                                    ? 'Evaluate your own performance'
                                    : 'Provide feedback for your colleague'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Draft Saved Indicator */}
                        {draftSaved && lastSaved && (
                            <div className="flex items-center gap-2 text-chart-1">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">
                                    Draft saved at{' '}
                                    {lastSaved.toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}

                        {/* Progress */}
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {progress}%
                            </span>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={completedQuestions < totalQuestions}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Submit
                        </Button>
                    </div>
                </div>
            </div>

            {/* Survey Content */}
            <div className="mx-auto max-w-4xl p-8">
                {/* Likert Scale Questions */}
                {questionsByCompetency.map((competency, compIndex) => (
                    <Card
                        key={competency.id}
                        className="mb-6 bg-card border-border"
                    >
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-semibold text-primary">
                                    {compIndex + 1}
                                </span>
                                <div>
                                    <CardTitle className="text-lg text-foreground">
                                        {competency.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {competency.description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {competency.questions.map((question, qIndex) => {
                                const globalIndex =
                                    questions.findIndex(
                                        (q) => q.id === question.id,
                                    ) + 1;
                                return (
                                    <div
                                        key={question.id}
                                        className="space-y-3"
                                    >
                                        <Label className="text-foreground">
                                            <span className="text-muted-foreground mr-2">
                                                {globalIndex}.
                                            </span>
                                            {question.text}
                                        </Label>
                                        <RadioGroup
                                            value={responses[question.id] || ''}
                                            onValueChange={(value) =>
                                                handleLikertChange(
                                                    question.id,
                                                    value,
                                                )
                                            }
                                            className="flex gap-2"
                                        >
                                            {likertScale.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="flex-1"
                                                >
                                                    <RadioGroupItem
                                                        value={option.value}
                                                        id={`${question.id}-${option.value}`}
                                                        className="peer sr-only"
                                                    />
                                                    <Label
                                                        htmlFor={`${question.id}-${option.value}`}
                                                        className={cn(
                                                            'flex h-12 cursor-pointer flex-col items-center justify-center rounded-lg border border-border bg-secondary/30 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground peer-aria-checked:border-primary peer-aria-checked:bg-primary/10 peer-aria-checked:text-primary',
                                                            responses[
                                                                question.id
                                                            ] ===
                                                                option.value &&
                                                                'border-primary bg-primary/10 text-primary',
                                                        )}
                                                    >
                                                        <span className="text-sm font-medium">
                                                            {option.label}
                                                        </span>
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                                            <span>Not applicable</span>
                                            <span>Strongly Disagree</span>
                                            <span>Neutral</span>
                                            <span>Strongly Agree</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}

                {/* Open-ended Questions */}
                <Card className="mb-6 bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/20 text-sm font-semibold text-chart-2">
                                Q
                            </span>
                            <div>
                                <CardTitle className="text-lg text-foreground">
                                    Qualitative Feedback
                                </CardTitle>
                                <CardDescription>
                                    Share your thoughts and observations
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {openEndedQuestions.map((question, index) => (
                            <div key={question.id} className="space-y-3">
                                <Label
                                    htmlFor={question.id}
                                    className="text-foreground"
                                >
                                    {question.text}
                                </Label>
                                <Textarea
                                    id={question.id}
                                    placeholder="Enter your response..."
                                    value={
                                        openEndedResponses[question.id] || ''
                                    }
                                    onChange={(e) =>
                                        handleOpenEndedChange(
                                            question.id,
                                            e.target.value,
                                        )
                                    }
                                    className="min-h-32 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground resize-none"
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pb-8">
                    <Button
                        variant="outline"
                        className="border-border text-foreground hover:bg-secondary"
                        onClick={() => router.push('/surveys')}
                    >
                        Save & Exit
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={completedQuestions < totalQuestions}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Survey
                    </Button>
                </div>
            </div>
        </div>
    );
}
