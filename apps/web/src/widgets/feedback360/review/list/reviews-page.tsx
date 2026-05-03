'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    AlarmClock,
    Archive,
    Eye,
    FilePlus2,
    FileUser,
    Hourglass,
    MessageCircle,
    Pencil,
    SquareCheck,
    UserRound,
} from 'lucide-react';
import Link from 'next/link';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import {
    useReviewAnswersCountsQuery,
    useReviewCycleTitlesQuery,
    useReviewQuestionCountsQuery,
    useReviewRespondentCountsQuery,
    useReviewReviewerCountsQuery,
    useReviewsQuery,
} from '@entities/feedback360/review/api/review.queries';
import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/feedback360/review/model/types';
import { ReviewsFilters } from '@entities/feedback360/review/ui/reviews-filters';
import { ReviewsTable } from '@entities/feedback360/review/ui/reviews-table';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/review/ui/stage-badge';
import { useUsersByUserIdsQuery } from '@entities/identity/user/api/user.queries';
import { type AuthContextType } from '@entities/identity/user/model/types';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Progress } from '@shared/components/ui/progress';
import { Spinner } from '@shared/components/ui/spinner';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { StatisticsCard } from '@shared/ui/statistics-card';
import { TablePagination } from '@shared/ui/table-pagination';
import { ReviewDashboard } from './review-dashboard';
import { ReviewList } from './review-list';

export function ReviewsPage({ currentUser }: { currentUser: AuthContextType }) {
    const allTabs = [
        { label: "My reviews", value: "my_reviews" },
    ];

    if (currentUser.isManager) {
        allTabs.push({ label: "Team reviews", value: "team_reviews" });
    }

    if (currentUser.isAdmin || currentUser.isHR) {
        allTabs.push({ label: "All reviews", value: "all_reviews" });
    }

    const [activeTab, setActiveTab] = useState<
        typeof allTabs[number]['value']
    >(allTabs[0].value);

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-8 flex flex-col">
                <Tabs defaultValue={allTabs[0].value} className="w-full">
                    <TabsList variant="default" className="rounded-full w-fit gap-2 mx-auto shadow-sm flex flex-col sm:flex-row">
                        {allTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className="rounded-full mx-auto"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                {/* My Reviews Dashboard (Employee only) */}
                {activeTab === allTabs[0].value && (
                    <ReviewDashboard currentUser={currentUser} isMyReviews={true} isTeamReviews={false} />
                )}
                {/* Team Reviews Dashboard (Manager only) */}
                {(currentUser.isManager) && activeTab === (allTabs.length > 2 ? allTabs[allTabs.length - 2].value : allTabs[allTabs.length - 1].value) && (
                    <ReviewDashboard currentUser={currentUser} isMyReviews={false} isTeamReviews={true} />
                )}
                {/* All Reviews Table (Admin and HR only) */}
                {(currentUser.isAdmin || currentUser.isHR) && activeTab === allTabs[allTabs.length - 1].value && (
                    <ReviewList currentUser={currentUser} />
                )}
            </div>
        </main>
    );
}
