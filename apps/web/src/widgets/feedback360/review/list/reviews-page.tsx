'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { ReviewFormDialog } from '@features/feedback360/review/form/ui/ReviewFormDialog';
import { Button } from '@shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Plus } from 'lucide-react';
import { ReviewDashboard } from './review-dashboard';
import { ReviewList } from './review-list';

export function ReviewsPage({ currentUser }: { currentUser: AuthContextType }) {
    const allTabs = [{ label: 'My reviews', value: 'my_reviews' }];

    if (currentUser.isManager) {
        allTabs.push({ label: 'Team reviews', value: 'team_reviews' });
    }

    if (currentUser.isAdmin || currentUser.isHR) {
        allTabs.push({ label: 'All reviews', value: 'all_reviews' });
    }

    const [activeTab, setActiveTab] = useState<
        (typeof allTabs)[number]['value']
    >(allTabs[0].value);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const isEmployee =
        !currentUser.isManager && !currentUser.isAdmin && !currentUser.isHR;
    const canCreateReview = currentUser.isAdmin || currentUser.isHR;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-6 sm:gap-8 flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {!isEmployee && (
                        <Tabs
                            defaultValue={allTabs[0].value}
                            className="w-full"
                        >
                            <TabsList
                                variant="default"
                                className="rounded-2xl sm:rounded-full w-fit gap-2 mx-auto shadow-sm flex flex flex-wrap  p-1 overflow-x-auto"
                            >
                                {allTabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        onClick={() => setActiveTab(tab.value)}
                                        className="rounded-full w-full sm:w-auto mx-auto text-base"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}
                    {canCreateReview && (
                        <Button
                            size="lg"
                            className="shrink-0 rounded-xl"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Review
                        </Button>
                    )}
                </div>
                {/* My Reviews Dashboard (for Employee) */}
                {activeTab === allTabs[0].value && (
                    <ReviewDashboard
                        currentUser={currentUser}
                        isMyReviews={true}
                        isTeamReviews={false}
                    />
                )}
                {/* Team Reviews Dashboard (Manager only) */}
                {currentUser.isManager &&
                    activeTab ===
                        (allTabs.length > 2
                            ? allTabs[allTabs.length - 2].value
                            : allTabs[allTabs.length - 1].value) && (
                        <ReviewDashboard
                            currentUser={currentUser}
                            isMyReviews={false}
                            isTeamReviews={true}
                        />
                    )}
                {/* All Reviews Table (Admin and HR only) */}
                {(currentUser.isAdmin || currentUser.isHR) &&
                    activeTab === allTabs[allTabs.length - 1].value && (
                        <ReviewList />
                    )}
            </div>

            <ReviewFormDialog
                mode="create"
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </main>
    );
}
