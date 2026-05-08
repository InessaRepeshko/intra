import { User } from '@entities/identity/user/model/mappers';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';

export function AvatarGroupList({ users }: { users: User[] }) {
    if (users.length === 0) {
        return <span className="text-muted-foreground"> None </span>;
    }

    return (
        <div className="flex flex-col flex-wrap items-start justify-start gap-1">
            {users.map((user) => (
                <div key={user.id} className="flex items-center gap-1">
                    <Avatar className="border-2 border-black/10 bg-neutral-100 rounded-full">
                        <AvatarImage
                            className="object-cover bg-white/20 text-black text-xs font-medium"
                            src={user.avatarUrl?.toString()}
                            alt={user.fullName}
                        />
                        <AvatarFallback className="bg-white/20 text-black text-xs font-medium">
                            {user.firstName?.charAt(0) +
                                user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium whitespace-pre-wrap text-foreground">
                        {user.fullName}
                    </span>
                </div>
            ))}
        </div>
    );
}
