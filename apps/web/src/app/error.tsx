'use client';

import { ErrorPageLayout } from '@shared/ui/error-page-layout';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorPageLayout
            code="500"
            title="Something went wrong"
            description={[
                'An unexpected server error occurred.',
                'You can try again or navigate back to safety.',
            ]}
            icon={AlertCircle}
            retryAction={{
                label: 'Try Again',
                onClick: reset,
            }}
        />
    );
}
