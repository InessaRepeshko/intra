'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { ClusterList } from '@widgets/library/cluster/list/cluster-list';

export default function ClustersPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Clusters" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <ClusterList />
            </div>
        </div>
    );
}
