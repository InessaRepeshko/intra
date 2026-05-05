import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { Award, Briefcase, Mail } from 'lucide-react';

export function UserBadgeWithPosition({
    user,
    imageClassName = "",
    textClassName = "",
    withEmail = false,
}: {
    user: {
        id: number;
        fullName: string;
        positionTitle: string;
        avatarUrl?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    imageClassName?: string;
    textClassName?: string;
    withEmail?: boolean;
}) {
    if (!user) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <div className="flex flex-col flex-wrap items-start justify-start gap-1">
            <div key={user.id} className="flex items-center gap-2">
                <Avatar className={`border-2 border-black/10 bg-neutral-100 rounded-full ${imageClassName}`}>
                    <AvatarImage
                        className="object-cover bg-white/20 text-black text-xs font-medium"
                        src={user.avatarUrl?.toString()}
                        alt={user.fullName}
                    />
                    <AvatarFallback className={`bg-white/20 text-black text-xs font-medium`}>
                        {getUserInitialsFromFullName(
                            user.fullName ??
                                `${user.lastName} ${user.firstName}`,
                        )}
                    </AvatarFallback>
                </Avatar>
                <span className={`flex flex-col break-word`}>
                    <span className={`font-medium whitespace-pre-wrap text-foreground ${textClassName}`}>
                        {user.fullName}
                    </span>
                    <span className="flex items-center gap-1 font-medium whitespace-pre-wrap text-muted-foreground">
                        {withEmail && <Award className='h-4 w-4' />}
                        {user.positionTitle}
                    </span>
                    {withEmail && (
                    <span className="flex items-center gap-1 font-medium whitespace-pre-wrap text-muted-foreground">
                        <Mail className='h-4 w-4' />
                        {user.email}
                    </span>
                    )}
                </span>
            </div>
        </div>
    );
}
