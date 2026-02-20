'use client';

import { IdentityRole } from '@/entities/user/model/types';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/shared/ui/collapsible';
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
    BarChart3,
    BookOpen,
    Building2,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    RefreshCw,
    User,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: IdentityRole[];
    children?: { title: string; href: string; roles?: IdentityRole[] }[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        title: '360 Feedback',
        href: '/feedback360',
        icon: RefreshCw,
        children: [
            {
                title: 'Cycles',
                href: '/feedback360/cycles',
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
            { title: 'Reviews', href: '/feedback360/reviews' },
        ],
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Library',
        href: '/library',
        icon: BookOpen,
        roles: [IdentityRole.HR, IdentityRole.ADMIN],
        children: [
            { title: 'Question Templates', href: '/library/questions' },
            { title: 'Competences', href: '/library/competences' },
            { title: 'Clusters', href: '/library/clusters' },
        ],
    },
    {
        title: 'Organisation',
        href: '/organisation',
        icon: Building2,
        children: [
            { title: 'Teams', href: '/organisation/teams' },
            { title: 'Positions', href: '/organisation/positions' },
        ],
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        roles: [IdentityRole.HR, IdentityRole.ADMIN],
    },
    {
        title: 'My Profile',
        href: '/profile',
        icon: User,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { user, hasRole } = useAuth();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const filteredItems = navItems.filter(
        (item) => !item.roles || item.roles.some((role) => hasRole(role)),
    );

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
            <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    I
                </div>
                <span className="text-lg font-semibold text-sidebar-foreground">
                    Intra 360
                </span>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="flex flex-col gap-1">
                    {filteredItems.map((item) => {
                        if (item.children) {
                            const visibleChildren = item.children.filter(
                                (child) =>
                                    !child.roles ||
                                    child.roles.some((role) => hasRole(role)),
                            );
                            if (visibleChildren.length === 0) return null;

                            return (
                                <Collapsible
                                    key={item.href}
                                    defaultOpen={isActive(item.href)}
                                >
                                    <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span className="flex-1 text-left">
                                            {item.title}
                                        </span>
                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="ml-4 flex flex-col gap-1 border-l border-sidebar-border pl-3 pt-1">
                                            {visibleChildren.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn(
                                                        'rounded-md px-3 py-1.5 text-sm transition-colors',
                                                        isActive(child.href)
                                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                                    )}
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive(item.href)
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="border-t border-sidebar-border p-3">
                <div className="flex items-center gap-3 rounded-md px-3 py-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.positionTitle}
                        </p>
                    </div>
                    <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Log out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
