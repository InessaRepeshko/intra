'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';

import { CycleDashboard } from './cycle-dashboard';
import { CycleList } from './cycle-list';

export function CyclesPage({ currentUser }: { currentUser: AuthContextType }) {
    const allTabs = [
        { label: 'Cycle Dashboard', value: 'cycle_dashboard' },
        { label: 'Cycle Table', value: 'cycle_table' },
    ];

    const [activeTab, setActiveTab] = useState<
        (typeof allTabs)[number]['value']
    >(allTabs[0].value);

    if (!currentUser.isAdmin && !currentUser.isHR) {
        return null;
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-6 sm:gap-8 flex flex-col">
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

                {activeTab === 'cycle_dashboard' && (
                    <CycleDashboard currentUser={currentUser} />
                )}
                {activeTab === 'cycle_table' && (
                    <CycleList currentUser={currentUser} />
                )}
            </div>
        </main>
    );
}
