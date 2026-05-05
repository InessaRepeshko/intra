'use client';
import { useAuth } from '@entities/identity/user/model/auth-context';
import { PageHeader } from '@shared/ui/app-sidebar';
import { ProfileContent } from '@widgets/profile/profile-content';
import { unauthorized } from 'next/navigation';

export default function Page() {
    const auth = useAuth();

    if (!auth.user) return unauthorized();

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Profile" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <ProfileContent />
            </div>
        </div>
    );
 />;
}
