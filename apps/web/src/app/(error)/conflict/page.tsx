'use client';

import { ErrorPageLayout } from '@shared/ui/error-page-layout';
import { FileX } from 'lucide-react';

export default function ConflictPage() {
    return (
        <ErrorPageLayout
            code="409"
            title="Conflict Detected"
            description={[
                'We could not process your request because it conflicts with the current data.',
                'Please check your input and try again.',
            ]}
            icon={FileX}
        />
    );
}
