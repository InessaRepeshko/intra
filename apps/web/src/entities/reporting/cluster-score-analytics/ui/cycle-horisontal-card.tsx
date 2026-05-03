import { User } from '@entities/identity/user/model/mappers';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Card } from '@shared/components/ui/card';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { MailIcon } from 'lucide-react';

export function CycleHorisontalCard({ ratee }: { ratee: User }) {
    if (!ratee) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-col sm:flex-row sm:flex-nowrap items-center text-center sm:text-left gap-4 p-4 w-full max-w-[500px]">
            <Avatar className="h-30 w-30 border bg-muted">
                <AvatarImage
                    className="object-cover"
                    src={ratee.avatarUrl?.toString()}
                    alt={ratee.fullName}
                />
                <AvatarFallback className="text-6xl font-medium text-muted-foreground bg-neutral-100">
                    {getUserInitialsFromFullName(
                        ratee.fullName ??
                            `${ratee.lastName} ${ratee.firstName}`,
                    )}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 flex-1 min-w-0 justify-center">
                <h3 className="text-2xl font-semibold text-foreground whitespace-pre-wrap">
                    {ratee.fullName}
                </h3>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-lg text-muted-foreground mt-0.5">
                    {ratee.positionTitle && (
                        <span className="font-medium whitespace-pre-wrap max-w-full">
                            {ratee.positionTitle}
                        </span>
                    )}
                    {ratee.positionTitle && ratee.teamTitle && (
                        <span className="text-muted-foreground hidden sm:inline">
                            •
                        </span>
                    )}
                    {ratee.teamTitle && (
                        <span className="whitespace-pre-wrap max-w-full">
                            {ratee.teamTitle}
                        </span>
                    )}
                </div>

                {ratee.email && (
                    <div className="flex items-center justify-center sm:justify-start gap-x-2 text-muted-foreground">
                        <MailIcon className="w-3 h-3 shrink-0" />
                        <span className="text-sm text-lg whitespace-pre-wrap max-w-full">
                            {ratee.email}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
