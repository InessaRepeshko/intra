'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';

import { useCreateCycleMutation } from '../api/create-cycle.mutation';
import { createCycleSchema, type CreateCycleFormValues } from '../model/schema';

function DatePickerField({
    value,
    onChange,
    placeholder,
}: {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder: string;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, 'MMM dd, yyyy') : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

interface CreateCycleFormProps {
    trigger: React.ReactNode;
}

export function CreateCycleForm({ trigger }: CreateCycleFormProps) {
    const [open, setOpen] = useState(false);
    const mutation = useCreateCycleMutation();

    const form = useForm<CreateCycleFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createCycleSchema) as any,
        defaultValues: {
            title: '',
            description: '',
            hrId: undefined as unknown as number,
            minRespondentsThreshold: 3,
        },
    });

    const onSubmit = (values: CreateCycleFormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Cycle</DialogTitle>
                    <DialogDescription>
                        Set up a new 360° feedback cycle for your organization.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. Q1 2026 Performance Review"
                            {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Optional description of the cycle..."
                            rows={3}
                            {...form.register('description')}
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* HR ID & Threshold */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="hrId">
                                HR ID{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="hrId"
                                type="number"
                                placeholder="e.g. 1"
                                {...form.register('hrId')}
                            />
                            {form.formState.errors.hrId && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.hrId.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="minRespondentsThreshold">
                                Min Respondents
                            </Label>
                            <Input
                                id="minRespondentsThreshold"
                                type="number"
                                placeholder="3"
                                {...form.register('minRespondentsThreshold')}
                            />
                            {form.formState.errors.minRespondentsThreshold && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors
                                            .minRespondentsThreshold.message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Start & End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>
                                Start Date{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <DatePickerField
                                value={form.watch('startDate')}
                                onChange={(date) =>
                                    form.setValue('startDate', date!, {
                                        shouldValidate: true,
                                    })
                                }
                                placeholder="Pick start date"
                            />
                            {form.formState.errors.startDate && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.startDate.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>
                                End Date{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <DatePickerField
                                value={form.watch('endDate')}
                                onChange={(date) =>
                                    form.setValue('endDate', date!, {
                                        shouldValidate: true,
                                    })
                                }
                                placeholder="Pick end date"
                            />
                            {form.formState.errors.endDate && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.endDate.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Optional Deadlines */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">
                            Optional Deadlines
                        </Label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">
                                    Response
                                </span>
                                <DatePickerField
                                    value={form.watch('responseDeadline')}
                                    onChange={(date) =>
                                        form.setValue('responseDeadline', date)
                                    }
                                    placeholder="Response"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">
                                    Review
                                </span>
                                <DatePickerField
                                    value={form.watch('reviewDeadline')}
                                    onChange={(date) =>
                                        form.setValue('reviewDeadline', date)
                                    }
                                    placeholder="Review"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">
                                    Approval
                                </span>
                                <DatePickerField
                                    value={form.watch('approvalDeadline')}
                                    onChange={(date) =>
                                        form.setValue('approvalDeadline', date)
                                    }
                                    placeholder="Approval"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? 'Creating...'
                                : 'Create Cycle'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
