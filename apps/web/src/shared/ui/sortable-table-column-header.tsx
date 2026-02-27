import { Button } from '@shared/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export function SortableHeader({
    label,
    wrapLabelText = false,
    field,
    currentField,
    currentDirection,
    onSort,
}: {
    label: string;
    wrapLabelText?: boolean;
    field: string;
    currentField: string;
    currentDirection: string;
    onSort: (field: string) => void;
}) {
    const isActive = currentField === field;
    return (
        <Button
            variant="ghost"
            size="sm"
            className={`mb-1 font-medium text-muted-foreground hover:text-foreground whitespace-normal text-center ${wrapLabelText ? 'text-wrap h-auto min-h-8 py-1 ' : 'whitespace-nowrap h-8'}`}
            onClick={() => onSort(field)}
        >
            {label}
            <ArrowUpDown
                className={`ml-1 h-3.5 w-3.5 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`}
            />
        </Button>
    );
}
