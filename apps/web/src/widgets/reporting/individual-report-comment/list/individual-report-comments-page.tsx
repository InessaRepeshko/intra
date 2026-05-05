'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';

import { IndividualReportCommentDashboard } from './individual-report-comment-dashboard';
import { IndividualReportCommentList } from './individual-report-comment-list';

export function IndividualReportCommentsPage({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    if (!currentUser.isAdmin && !currentUser.isHR) {
        return null;
    }

    const allTabs = [
        { label: 'Comments Dashboard', value: 'comments_dashboard' },
        { label: 'Comments Table', value: 'comments_table' },
    ];

    const [activeTab, setActiveTab] = useState<
        (typeof allTabs)[number]['value']
    >(allTabs[0].value);

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-6 sm:gap-8 flex flex-col w-full min-w-0">
                <Tabs defaultValue={allTabs[0].value} className="w-full">
                    <TabsList
                        variant="default"
                        className="rounded-2xl sm:rounded-full w-fit gap-2 mx-auto shadow-sm flex flex-wrap p-1 overflow-x-auto"
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

                {activeTab === 'comments_dashboard' && (
                    <IndividualReportCommentDashboard
                        currentUser={currentUser}
                    />
                )}

                {activeTab === 'comments_table' && (
                    <IndividualReportCommentList />
                )}
            </div>
        </main>
    );
}
