export function TableColumnHeader({
    label,
    wrapLabelText = false,
    className = '',
}: {
    label: string[] | string;
    wrapLabelText?: boolean;
    className?: string;
}) {
    return (
        <div
            className={`flex flex-col mb-1 font-medium text-muted-foreground hover:text-foreground whitespace-normal text-start 
        ${wrapLabelText ? 'text-wrap h-auto min-h-8 py-1 ' : 'whitespace-nowrap h-8'} ${className}`}
        >
            {typeof label === 'string'
                ? label
                : label.map((line, index) => <span key={index}>{line}</span>)}
        </div>
    );
}
