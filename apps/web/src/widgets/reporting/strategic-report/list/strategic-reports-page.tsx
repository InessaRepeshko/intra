'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';

import { StrategicReportDashboard } from './strategic-report-dashboard';
import { StrategicReportList } from './strategic-report-list';

export function StrategicReportsPage({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    if (!currentUser.isAdmin && !currentUser.isHR) {
        return null;
    }

    const allTabs = [
        { label: 'Report Dashboard', value: 'report_dashboard' },
        { label: 'Report Table', value: 'report_table' },
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

                {activeTab === 'report_dashboard' && (
                    <StrategicReportDashboard currentUser={currentUser} />
                )}
                {activeTab === 'report_table' && <StrategicReportList />}
            </div>
        </main>
    );
}
