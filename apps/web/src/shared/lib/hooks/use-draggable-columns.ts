import { useCallback, useEffect, useRef, useState } from 'react';

export function useDraggableColumns<T extends string>(
    tableId: string,
    initialOrder: T[],
) {
    const [columnOrder, setColumnOrder] = useState<T[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`draggable-columns-${tableId}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Basic validation to ensure the saved structure has the same length.
                    if (
                        Array.isArray(parsed) &&
                        parsed.length === initialOrder.length
                    ) {
                        return parsed as T[];
                    }
                } catch (e) {
                    console.error(
                        'Failed to parse columns from localStorage',
                        e,
                    );
                }
            }
        }
        return initialOrder;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                `draggable-columns-${tableId}`,
                JSON.stringify(columnOrder),
            );
        }
    }, [tableId, columnOrder]);

    const draggedColumn = useRef<T | null>(null);

    const handleDragStart = useCallback((columnId: T) => {
        draggedColumn.current = columnId;
    }, []);

    const handleDragEnter = useCallback((targetColumnId: T) => {
        if (
            !draggedColumn.current ||
            draggedColumn.current === targetColumnId
        ) {
            return;
        }

        setColumnOrder((prevOrder) => {
            const newOrder = [...prevOrder];
            const draggedIndex = newOrder.indexOf(draggedColumn.current!);
            const targetIndex = newOrder.indexOf(targetColumnId);

            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, draggedColumn.current!);

            return newOrder;
        });
    }, []);

    const handleDragEnd = useCallback(() => {
        draggedColumn.current = null;
    }, []);

    const initialOrderRef = useRef(initialOrder);

    const resetOrder = useCallback(() => {
        setColumnOrder(initialOrderRef.current);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`draggable-columns-${tableId}`);
        }
    }, [tableId]);

    return {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    };
}
