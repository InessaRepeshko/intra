'use client';

import { useState } from 'react';

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import type { AuthContextType } from '@entities/identity/user/model/types';
import { IndividualReportDashboard } from './individual-report-dashboard';
import { IndividualReportList } from './individual-report-list';

export function IndividualReportsPage({ currentUser }: { currentUser: AuthContextType }) {
    const allTabs = [
        { label: 'My Reports', value: 'my_reports' },
    ];

    if (currentUser.isManager) {
        allTabs.push({ label: 'Team Reports', value: 'team_reports' });
    }

    if (currentUser.isAdmin || currentUser.isHR) {
        allTabs.push({ label: 'All Reports', value: 'all_reports' });
    }

    const [activeTab, setActiveTab] = useState<
        (typeof allTabs)[number]['value']
    >(allTabs[0].value);

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

                {/* My Reports Dashboard (for Employee) */}
                {activeTab === allTabs[0].value && (
                    <IndividualReportDashboard 
                        currentUser={currentUser}
                        isMyReports={true}
                        isTeamReports={false}
                    />
                )}

                {/* Team Reports Dashboard (Manager only) */}
                {currentUser.isManager &&
                    activeTab ===
                        (allTabs.length > 2
                            ? allTabs[allTabs.length - 2].value
                            : allTabs[allTabs.length - 1].value) && (
                        <IndividualReportDashboard
                            currentUser={currentUser}
                            isMyReports={false}
                            isTeamReports={true}
                        />
                    )}

                {/* Individual Reports Table (Admin and HR only) */}
                {(currentUser.isAdmin || currentUser.isHR) &&
                    activeTab === allTabs[allTabs.length - 1].value && (
                         <IndividualReportList />
                    )}
            </div>
        </main>
    );
}
