import { User } from '@entities/identity/user/model/mappers';
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '@shared/components/ui/avatar';

export function AvatarGroupWithCount({ users }: { users: User[] }) {
    const maxVisibleUsers = 3;
    const visibleUsers = users.slice(0, maxVisibleUsers);
    const remainingCount = users.length - maxVisibleUsers;

    if (users.length === 0) {
        return <span className="text-muted-foreground"> None </span>;
    }

    return (
        <AvatarGroup>
            {visibleUsers.map((user) => (
                <Avatar
                    key={user.id}
                    className="border-2 rounded-full border-black/10 bg-neutral-100"
                >
                    <AvatarImage
                        className="object-cover bg-white/20 text-black text-xs font-medium"
                        src={user.avatarUrl?.toString()}
                        alt={user.fullName}
                    />
                    <AvatarFallback className="bg-white/20 text-black text-xs font-medium">
                        {user.firstName?.charAt(0) + user.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            ))}
            {remainingCount > 0 && (
                <AvatarGroupCount className="text-black text-xs font-medium border-2 border-black/10">
                    +{remainingCount}
                </AvatarGroupCount>
            )}
        </AvatarGroup>
    );
}
