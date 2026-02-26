'use client';

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxClear,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from '@/shared/components/ui/combobox';
import { cn } from '@/shared/lib/utils/cn';
import * as React from 'react';

interface MultiSelectProps {
    options: { label: string; value: string; badgeClassName?: string }[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    emptyText?: string;
    className?: string;
    showClear?: boolean;
    icon?: React.ReactNode;
}

export function MultiSelect({
    options,
    value,
    onValueChange,
    placeholder = 'Select items...',
    emptyText = 'No items found.',
    className,
    showClear = false,
    icon,
}: MultiSelectProps) {
    const anchor = useComboboxAnchor();
    const itemValues = options.map((opt) => opt.value);

    return (
        <Combobox
            multiple
            autoHighlight
            items={itemValues}
            value={value}
            onValueChange={(val) => onValueChange(val as string[])}
            filter={(itemValue: string, query: string) => {
                const option = options.find((o) => o.value === itemValue);
                if (!option) return false;
                return option.label.toLowerCase().includes(query.toLowerCase());
            }}
        >
            <ComboboxChips
                ref={anchor}
                className={cn('w-full bg-background', className)}
            >
                {icon && (
                    <div
                        className={cn(
                            'flex shrink-0 items-center',
                            value.length === 0
                                ? 'text-muted-foreground'
                                : 'text-foreground',
                        )}
                    >
                        {icon}
                    </div>
                )}
                <ComboboxValue>
                    {(selectedValues: string[]) => (
                        <React.Fragment>
                            {selectedValues.map((val) => {
                                const option = options.find(
                                    (o) => o.value === val,
                                );
                                return (
                                    <ComboboxChip
                                        key={val}
                                        className={cn(
                                            option?.badgeClassName ||
                                            'bg-muted text-foreground',
                                            option?.badgeClassName &&
                                            'border font-medium',
                                        )}
                                    >
                                        {option ? option.label : val}
                                    </ComboboxChip>
                                );
                            })}
                            <ComboboxChipsInput
                                placeholder={
                                    value.length === 0 ? placeholder : ''
                                }
                                className={cn(
                                    value.length > 0
                                        ? '!flex-none !w-auto !min-w-[4px] ml-1'
                                        : '',
                                )}
                            />
                        </React.Fragment>
                    )}
                </ComboboxValue>
                {showClear && value.length > 0 && (
                    <ComboboxClear
                        className="ml-auto flex size-4 flex-shrink-0 items-center justify-center p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onValueChange([]);
                        }}
                    />
                )}
            </ComboboxChips>
            <ComboboxContent
                anchor={anchor}
                className="w-[--anchor-width] min-w-48 p-0"
            >
                <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                <ComboboxList>
                    {(item: string) => {
                        const option = options.find((o) => o.value === item);
                        return (
                            <ComboboxItem
                                key={item}
                                value={item}
                                className="gap-2"
                            >
                                {option?.badgeClassName ? (
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
                                            option.badgeClassName,
                                        )}
                                    >
                                        {option.label}
                                    </span>
                                ) : (
                                    <span>{option ? option.label : item}</span>
                                )}
                            </ComboboxItem>
                        );
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
