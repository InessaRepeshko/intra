'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { UsersList } from '@widgets/identity/users/list/user-list';

export default function UsersPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Users" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <UsersList />
            </div>
        </div>
    );
}
