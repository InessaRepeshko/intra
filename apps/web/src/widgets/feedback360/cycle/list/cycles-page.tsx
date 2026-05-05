'use client';

import { useState } from 'react';

import { type AuthContextType } from '@entities/identity/user/model/types';
import { CycleFormDialog } from '@features/feedback360/cycle/form/ui/CycleFormDialog';
import { Button } from '@shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Plus } from 'lucide-react';

import { CycleDashboard } from './cycle-dashboard';
import { CycleList } from './cycle-list';

export function CyclesPage({ currentUser }: { currentUser: AuthContextType }) {
    if (!currentUser.isAdmin && !currentUser.isHR) {
        return null;
    }

    const allTabs = [
        { label: 'Cycle Dashboard', value: 'cycle_dashboard' },
        { label: 'Cycle Table', value: 'cycle_table' },
    ];

    const [activeTab, setActiveTab] = useState<
        (typeof allTabs)[number]['value']
    >(allTabs[0].value);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-6 sm:gap-8 flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-4">
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
                    {/* <Button
                        size="lg"
                        className="shrink-0 rounded-xl"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Cycle
                    </Button> */}
                </div>

                {activeTab === 'cycle_dashboard' && (
                    <CycleDashboard currentUser={currentUser} />
                )}
                {activeTab === 'cycle_table' && <CycleList />}
            </div>

            {/* <CycleFormDialog
                mode="create"
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            /> */}
        </main>
    );
}
