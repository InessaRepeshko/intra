'use client';

import { ErrorPageLayout } from '@shared/ui/error-page-layout';
import { FileExclamationPoint } from 'lucide-react';

export default function BadRequestPage() {
    return (
        <ErrorPageLayout
            code="400"
            title="Bad Request"
            description={[
                'We could not process your request due to invalid data.',
                'Please check your input and try again.',
            ]}
            icon={FileExclamationPoint}
        />
    );
}
