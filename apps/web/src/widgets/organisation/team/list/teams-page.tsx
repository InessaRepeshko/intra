'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';

import { TeamDashboard } from './team-dashboard';
import { TeamList } from './team-list';

export function TeamsPage({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const allTabs = [
        { label: 'Team Dashboard', value: 'team_dashboard' },
        { label: 'Team Table', value: 'team_table' },
    ];

    const [activeTab, setActiveTab] = useState<
        (typeof allTabs)[number]['value']
    >(allTabs[0].value);

    const isEmployee = !currentUser.isManager && !currentUser.isAdmin && !currentUser.isHR;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-6 sm:gap-8 flex flex-col w-full min-w-0">
                {!isEmployee && (
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
                )}

                {activeTab === 'team_dashboard' && (
                    <TeamDashboard currentUser={currentUser} />
                )}
                {activeTab === 'team_table' && <TeamList />}
            </div>
        </main>
    );
}
