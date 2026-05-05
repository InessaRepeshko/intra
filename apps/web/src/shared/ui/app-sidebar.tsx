'use client';

import { useAuth } from '@entities/identity/user/model/auth-context';
import { IdentityRole } from '@entities/identity/user/model/types';
import logo from '@public/logo.png';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@shared/components/ui/collapsible';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { cn } from '@shared/lib/utils/cn';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import {
    Award,
    Bookmark,
    Boxes,
    Building2,
    ChevronDown,
    FileChartColumn,
    FileChartLine,
    FileQuestionMark,
    FileUser,
    Layers2,
    LayoutDashboard,
    LibraryBig,
    MessageCircle,
    MessageSquareQuote,
    NotebookTabs,
    Orbit,
    PanelLeft,
    RefreshCw,
    UserRound,
    UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    toggle: () => void;
    isMounted: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: IdentityRole[];
    excludePaths?: RegExp[];
    matchPaths?: RegExp[];
    children?: {
        title: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
        roles?: IdentityRole[];
        excludePaths?: RegExp[];
        matchPaths?: RegExp[];
    }[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: '360° Feedback',
        href: '/feedback360',
        icon: Orbit,
        children: [
            {
                title: 'Cycles',
                href: '/feedback360/cycles',
                icon: RefreshCw,
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
            {
                title: 'Reviews',
                href: '/feedback360/reviews',
                icon: NotebookTabs,
            },
            {
                title: 'Surveys',
                href: '/feedback360/surveys',
                icon: MessageCircle,
            },
        ],
    },
    {
        title: 'Reporting',
        href: '/reporting',
        icon: FileChartColumn,
        children: [
            {
                title: 'Comments',
                href: '/reporting/individual-reports/comments',
                icon: MessageSquareQuote,
                matchPaths: [
                    /^\/reporting\/individual-reports(\/\d+)?\/comments/,
                ],
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
            {
                title: 'Individual Reports',
                href: '/reporting/individual-reports',
                icon: FileUser,
                excludePaths: [
                    /^\/reporting\/individual-reports(\/\d+)?\/comments/,
                ],
            },
            {
                title: 'Strategic Reports',
                href: '/reporting/strategic-reports',
                icon: FileChartLine,
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
            {
                title: 'Cluster Score Analytics',
                href: '/reporting/cluster-score-analytics',
                icon: Boxes,
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
        ],
    },
    {
        title: 'Library',
        href: '/library',
        icon: LibraryBig,
        roles: [IdentityRole.HR, IdentityRole.ADMIN],
        children: [
            {
                title: 'Question Templates',
                href: '/library/question-templates',
                icon: FileQuestionMark,
            },
            {
                title: 'Competences',
                href: '/library/competences',
                icon: Bookmark,
            },
            {
                title: 'Clusters',
                href: '/library/clusters',
                icon: Layers2,
            },
        ],
    },
    {
        title: 'Organisation',
        href: '/organisation',
        icon: Building2,
        children: [
            {
                title: 'Teams',
                href: '/organisation/teams',
                icon: UsersRound,
            },
            {
                title: 'Positions',
                href: '/organisation/positions',
                icon: Award,
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
            {
                title: 'Users',
                href: '/identity/users',
                icon: UserRound,
                roles: [IdentityRole.HR, IdentityRole.ADMIN],
            },
        ],
    },
];

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem('sidebar:collapsed');
        if (stored) {
            setCollapsed(stored === 'true');
        }
    }, []);

    const toggle = () => {
        setCollapsed((prev) => {
            const nextValue = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebar:collapsed', String(nextValue));
            }
            return nextValue;
        });
    };

    return (
        <SidebarContext.Provider
            value={{ collapsed, setCollapsed, toggle, isMounted }}
        >
            <div
                style={{
                    display: 'contents',
                    visibility: isMounted ? 'visible' : 'hidden',
                }}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    );
}

export function AppSidebar() {
    const pathname = usePathname();
    const { user, hasRole } = useAuth();
    const { collapsed, toggle, isMounted } = useSidebar();

    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const stored = localStorage.getItem('sidebar:openItems');
        if (stored) {
            try {
                setOpenItems(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse sidebar items state', e);
            }
        }
    }, [isMounted]);

    const toggleItem = (
        title: string,
        defaultOpen: boolean,
        currentOpen?: boolean,
    ) => {
        const currentState = currentOpen ?? openItems[title] ?? defaultOpen;
        const newState = !currentState;
        const nextItems = { ...openItems, [title]: newState };
        setOpenItems(nextItems);
        localStorage.setItem('sidebar:openItems', JSON.stringify(nextItems));
    };

    const isItemOpen = (title: string, defaultOpen: boolean) => {
        return openItems[title] ?? defaultOpen;
    };

    const isActive = (
        href: string,
        excludePaths?: RegExp[],
        matchPaths?: RegExp[],
    ) => {
        if (href === '/') return pathname === '/';
        if (excludePaths?.some((regex) => regex.test(pathname ?? '')))
            return false;
        if (matchPaths?.some((regex) => regex.test(pathname ?? '')))
            return true;
        if (pathname === href) return true;
        return pathname?.startsWith(href + '/');
    };

    const filteredItems = navItems.filter(
        (item) => !item.roles || item.roles.some((role) => hasRole(role)),
    );

    if (collapsed) {
        return (
            <aside className="flex h-screen w-18 flex-col border-r border-white/10 bg-sidebar-light">
                <div className="flex h-16 shrink-0 items-center justify-center border-b border-white/10 px-4 transition-colors mx-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 hover:bg-black transition-colors">
                            <img
                                src={logo.src}
                                alt="Intra"
                                className="h-7 w-7"
                            />
                        </div>
                    </Link>
                </div>

                <ScrollArea className="flex-1 min-h-0 px-2 py-1">
                    <nav className="flex flex-col items-center gap-2 px-2 py-2">
                        {filteredItems.map((item) => {
                            if (item.children) {
                                const visibleChildren = item.children.filter(
                                    (child) =>
                                        !child.roles ||
                                        child.roles.some((role) =>
                                            hasRole(role),
                                        ),
                                );
                                if (visibleChildren.length === 0) return null;

                                const itemActive = isActive(
                                    item.href,
                                    item.excludePaths,
                                    item.matchPaths,
                                );
                                const openState = isItemOpen(
                                    item.title,
                                    itemActive,
                                );

                                return (
                                    <Collapsible
                                        key={item.href}
                                        open={openState}
                                        onOpenChange={() =>
                                            toggleItem(
                                                item.title,
                                                itemActive,
                                                openState,
                                            )
                                        }
                                    >
                                        <CollapsibleTrigger
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors mx-auto relative group whitespace-nowrap',
                                                itemActive
                                                    ? 'text-white bg-gradient-to-br from-stone-900 to-stone-900/80 shadow-lg/80 shadow-primary/20 hover:bg-black hover:text-white'
                                                    : 'text-black/70 hover:bg-white/10 hover:text-black',
                                            )}
                                            title={item.title}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            <ChevronDown
                                                className={cn(
                                                    'absolute -bottom-1 -right-1 h-3 w-3 shrink-0 transition-colors duration-200 bg-background rounded-full border border-border text-foreground',
                                                    openState && 'rotate-180',
                                                )}
                                            />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <div className="flex flex-col items-center gap-1 pt-2 pb-1">
                                                {visibleChildren.map(
                                                    (child) => (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className={cn(
                                                                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors mx-auto',
                                                                isActive(
                                                                    child.href,
                                                                    child.excludePaths,
                                                                    child.matchPaths,
                                                                )
                                                                    ? 'text-white bg-gradient-to-br from-stone-900 to-stone-900/80 shadow-md shadow-primary/20 hover:bg-black hover:text-white'
                                                                    : 'text-black/70 hover:bg-white/10 hover:text-black',
                                                            )}
                                                            title={child.title}
                                                        >
                                                            <child.icon className="h-4 w-4 shrink-0" />
                                                        </Link>
                                                    ),
                                                )}
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
                                        'flex h-10 w-10 items-center justify-center rounded-xl px-0 text-sm font-medium transition-colors whitespace-nowrap',
                                        isActive(
                                            item.href,
                                            item.excludePaths,
                                            item.matchPaths,
                                        )
                                            ? 'text-white bg-gradient-to-br from-stone-900 to-stone-900/80 shadow-lg/80 shadow-primary/20 hover:bg-black hover:text-white'
                                            : 'text-black/70 hover:bg-white/10 hover:text-black',
                                    )}
                                    title={item.title}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                </Link>
                            );
                        })}
                    </nav>
                </ScrollArea>

                <div className="shrink-0 py-3 pl-5 pr-3">
                    <Link href="/profile">
                    <div className="flex flex-col items-center gap-3 py-2">
                        <Avatar className="h-14 w-14 border bg-muted shrink-0">
                            <AvatarImage
                                className="object-cover"
                                src={user.avatarUrl || ''}
                                alt={user.fullName}
                            />
                            <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                {getUserInitialsFromFullName(
                                    user.fullName ??
                                        `${user.lastName} ${user.firstName}`,
                                )}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    </Link>
                </div>
            </aside>
        );
    }

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-sidebar-light">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group transition-colors"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 hover:bg-black transition-colors">
                        <img src={logo.src} alt="Intra" className="h-7 w-7" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">
                        Intra
                    </span>
                </Link>
            </div>

            <ScrollArea className="flex-1 min-h-0 px-2 py-1">
                <nav className="flex flex-col gap-2 px-2 py-2">
                    {filteredItems.map((item) => {
                        if (item.children) {
                            const visibleChildren = item.children.filter(
                                (child) =>
                                    !child.roles ||
                                    child.roles.some((role) => hasRole(role)),
                            );
                            if (visibleChildren.length === 0) return null;

                            const itemActive = isActive(
                                item.href,
                                item.excludePaths,
                                item.matchPaths,
                            );
                            const openState = isItemOpen(
                                item.title,
                                itemActive,
                            );

                            return (
                                <Collapsible
                                    key={item.href}
                                    open={openState}
                                    onOpenChange={() =>
                                        toggleItem(
                                            item.title,
                                            itemActive,
                                            openState,
                                        )
                                    }
                                >
                                    <CollapsibleTrigger
                                        className={cn(
                                            'flex h-10 w-10 py-2.5 px-2.5 mx-auto w-full transition-colors gap-3 rounded-xl text-sm font-medium items-center justify-start whitespace-nowrap',
                                            itemActive
                                                ? 'text-white bg-gradient-to-br from-stone-900 to-stone-900/80 shadow-lg/80 shadow-primary/20 hover:bg-black hover:text-white'
                                                : 'text-black/70 hover:bg-white/10 hover:text-black',
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="flex-1 text-left whitespace-nowrap">
                                            {item.title}
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                'h-4 w-4 shrink-0 transition-colors duration-200',
                                                openState && 'rotate-180',
                                            )}
                                        />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="flex flex-col gap-1 border-l border-white/20 pl-3 pt-1 mt-1">
                                            {visibleChildren.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn(
                                                        'flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors items-center justify-start',
                                                        isActive(
                                                            child.href,
                                                            child.excludePaths,
                                                            child.matchPaths,
                                                        )
                                                            ? 'text-white bg-gradient-to-br from-stone-900 to-stone-900/80 shadow-lg/80 shadow-primary/20 hover:bg-black hover:text-white'
                                                            : 'text-black/70 hover:bg-white/10 hover:text-black',
                                                    )}
                                                    title={child.title}
                                                >
                                                    <child.icon className="h-5 w-5 shrink-0" />
                                                    <span className="flex-1 text-left">
                                                        {child.title}
                                                    </span>
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
                                    'flex h-10 items-center gap-3 rounded-xl py-2.5 px-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                                    isActive(
                                        item.href,
                                        item.excludePaths,
                                        item.matchPaths,
                                    )
                                        ? 'text-white bg-gradient-to-br from-stone-900 to-stone-900/80 shadow-lg/80 shadow-primary/20 hover:bg-black hover:text-white'
                                        : 'text-black/70 hover:bg-white/10 hover:text-black',
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="shrink-0 p-3">
                <Link href="/profile">
                <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-14 w-14 border bg-muted shrink-0">
                        <AvatarImage
                            className="object-cover"
                            src={user.avatarUrl || ''}
                            alt={user.fullName}
                        />
                        <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                            {getUserInitialsFromFullName(
                                user.fullName ??
                                    `${user.lastName} ${user.firstName}`,
                            )}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-black break-words">
                            {user.firstName + ' ' + user.lastName}
                        </p>
                        <p className="text-sm text-black/70 break-words">
                            {user.positionTitle}
                        </p>
                    </div>
                </div>
                </Link>
            </div>
        </aside>
    );
}

export function PageHeader({ title }: { title: string }) {
    const { toggle } = useSidebar();

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background rounded-t-xl px-4 py-4">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggle}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-accent-foreground transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <PanelLeft className="h-6 w-6" />
                </button>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
            </div>
        </header>
    );
}
