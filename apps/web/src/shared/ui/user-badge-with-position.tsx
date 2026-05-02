import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';

export function UserBadgeWithPosition({
    user,
}: {
    user: {
        id: number;
        fullName: string;
        positionTitle: string;
        avatarUrl?: string;
        firstName?: string;
        lastName?: string;
    };
}) {
    if (!user) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <div className="flex flex-col flex-wrap items-start justify-start gap-1">
            <div key={user.id} className="flex items-center gap-1">
                <Avatar className="border-2 border-black/10 bg-neutral-100 rounded-full">
                    <AvatarImage
                        className="object-cover bg-white/20 text-black text-xs font-medium"
                        src={user.avatarUrl?.toString()}
                        alt={user.fullName}
                    />
                    <AvatarFallback className="bg-white/20 text-black text-xs font-medium">
                        {getUserInitialsFromFullName(user.fullName ?? `${user.lastName} ${user.firstName}`)}
                    </AvatarFallback>
                </Avatar>
                <span className="flex flex-col break-word">
                    <span className="text-sm font-medium whitespace-pre-wrap text-foreground">
                        {user.fullName}
                    </span>
                    <span className="text-xs font-medium whitespace-pre-wrap text-muted-foreground">
                        {user.positionTitle}
                    </span>
                </span>
            </div>
        </div>
    );
}
