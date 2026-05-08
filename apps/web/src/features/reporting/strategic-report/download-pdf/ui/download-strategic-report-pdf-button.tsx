'use client';

import { Button } from '@shared/components/ui/button';
import { Download } from 'lucide-react';
import { useCallback, useState, type RefObject } from 'react';
import { useReactToPrint } from 'react-to-print';

const DEFAULT_PRINT_WIDTH_PX = 1300;

interface DownloadStrategicReportPdfButtonProps {
    contentRef: RefObject<HTMLDivElement | null>;
    reportId: number;
    printWidth?: number | 'current';
}

export function DownloadStrategicReportPdfButton({
    contentRef,
    reportId,
    printWidth = DEFAULT_PRINT_WIDTH_PX,
}: DownloadStrategicReportPdfButtonProps) {
    const [resolvedWidth, setResolvedWidth] = useState<number>(
        typeof printWidth === 'number' ? printWidth : DEFAULT_PRINT_WIDTH_PX,
    );

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Strategic Report #${reportId}`,
        pageStyle: `
            @page { size: ${resolvedWidth}px auto; margin: 12mm; }
            @media print {
                html, body {
                    width: ${resolvedWidth}px !important;
                    min-width: ${resolvedWidth}px !important;
                    max-width: ${resolvedWidth}px !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow-x: hidden !important;
                }
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                [data-print-root] {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    overflow-x: hidden !important;
                }
                [data-print-root] .max-w-8xl {
                    max-width: 100% !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                }
                [data-print-root] img,
                [data-print-root] svg,
                [data-print-root] table {
                    max-width: 100% !important;
                }
                .recharts-wrapper,
                .recharts-surface {
                    max-width: 100% !important;
                    page-break-inside: avoid;
                }
            }
        `,
    });

    const onClick = useCallback(() => {
        if (printWidth === 'current' && typeof window !== 'undefined') {
            const current = window.innerWidth;
            if (current !== resolvedWidth) {
                setResolvedWidth(current);
                queueMicrotask(() => handlePrint());
                return;
            }
        }
        handlePrint();
    }, [printWidth, resolvedWidth, handlePrint]);

    return (
        <Button variant="default" onClick={onClick} className="rounded-xl">
            <Download className="h-4 w-4" />
            Download PDF
        </Button>
    );
}
