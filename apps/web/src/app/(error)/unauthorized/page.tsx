'use client';

import { ErrorPageLayout } from '@shared/ui/error-page-layout';
import { FileLock } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <ErrorPageLayout
            code="401"
            title="Unauthorized"
            description={[
                'Your session has expired or you are not signed in.',
                'Please sign in to access this page.',
            ]}
            icon={FileLock}
            primaryActionText="Go to Sign In"
            primaryActionHref="/signin"
        />
    );
}
