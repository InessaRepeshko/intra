'use client';

import { ErrorPageLayout } from '@shared/ui/error-page-layout';
import { FileKey } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <ErrorPageLayout
            code="403"
            title="Forbidden"
            description={[
                'You do not have permission to access this page.',
                'If you think this is a mistake, please contact your manager or system administrator.',
            ]}
            icon={FileKey}
        />
    );
}
