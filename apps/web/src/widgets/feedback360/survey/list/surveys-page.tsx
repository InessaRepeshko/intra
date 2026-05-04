'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';

import { SurveyDashboard } from './survey-dashboard';
import { SurveyList } from './survey-list';

export function SurveysPage({ currentUser }: { currentUser: AuthContextType }) {
    const allTabs = [{ label: 'My Surveys', value: 'my_surveys' }];

    if (currentUser.isManager) {
        allTabs.push({ label: 'My Team Surveys', value: 'my_team_surveys' });
    }

    if (currentUser.isAdmin || currentUser.isHR) {
        allTabs.push({ label: 'All Surveys', value: 'all_surveys' });
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

                {/* My Surveys Dashboard (all users) */}
                {activeTab === 'my_surveys' && (
                    <SurveyDashboard
                        currentUser={currentUser}
                        isMySurveys={true}
                        isMyTeamSurveys={false}
                    />
                )}

                {/* My Team Surveys Dashboard (Manager only) */}
                {currentUser.isManager && activeTab === 'my_team_surveys' && (
                    <SurveyDashboard
                        currentUser={currentUser}
                        isMySurveys={false}
                        isMyTeamSurveys={true}
                    />
                )}

                {/* All Surveys Table (Admin and HR only) */}
                {(currentUser.isAdmin || currentUser.isHR) &&
                    activeTab === 'all_surveys' && (
                        <SurveyList />
                    )}
            </div>
        </main>
    );
}
