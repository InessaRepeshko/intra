'use client';

import { useAuth } from '@entities/identity/user/model/auth-context';
import { mockRespondents, mockReviews } from '@lib/mock-data';
import { Avatar, AvatarFallback } from '@shared/components/ui/avatar';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import { PageHeader } from '@shared/ui/app-sidebar';
import { StatusBadge } from '@shared/ui/status-badge';
import { Briefcase, Building2, ClipboardList, Mail } from 'lucide-react';
import Link from 'next/link';

export function ProfileContent() {
    const { user } = useAuth();

    const myPendingSurveys = mockRespondents.filter(
        (r) => r.respondentId === user.id && r.responseStatus === 'PENDING',
    );
    const pendingReviews = myPendingSurveys
        .map((resp) => {
            const review = mockReviews.find((r) => r.id === resp.reviewId);
            return review ? { ...resp, review } : null;
        })
        .filter(Boolean) as Array<
        (typeof mockRespondents)[0] & { review: (typeof mockReviews)[0] }
    >;

    const myReportsAsRatee = mockReviews.filter(
        (r) => r.rateeId === user.id && r.stage === 'PROCESSING_BY_HR',
    );

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Profile" />
            <div className="flex flex-col gap-6 p-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {user.fullName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {user.positionTitle}
                            {user.teamTitle ? ` - ${user.teamTitle}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            {user.roles.map((role) => (
                                <Badge
                                    key={role}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Email
                                </p>
                            </div>
                            <p className="mt-2 text-sm font-medium text-foreground">
                                {user.email}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Position
                                </p>
                            </div>
                            <p className="mt-2 text-sm font-medium text-foreground">
                                {user.positionTitle || '---'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Team
                                </p>
                            </div>
                            <p className="mt-2 text-sm font-medium text-foreground">
                                {user.teamTitle || '---'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Pending Surveys
                                </p>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                {pendingReviews.length}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Surveys */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            My Active Surveys
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ratee</TableHead>
                                    <TableHead>Cycle</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingReviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-16 text-center text-muted-foreground"
                                        >
                                            No pending surveys.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingReviews.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-sm">
                                                {item.review.rateeFullName}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.review.cycleTitle ||
                                                    '---'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={
                                                        item.responseStatus as any
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" asChild>
                                                    <Link
                                                        href={`/feedback360/reviews/${item.review.id}/survey`}
                                                    >
                                                        Take Survey
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* My Reports */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">My Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cycle</TableHead>
                                    <TableHead>Stage</TableHead>
                                    <TableHead>Responses</TableHead>
                                    <TableHead className="w-[80px]">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myReportsAsRatee.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-16 text-center text-muted-foreground"
                                        >
                                            No reports available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    myReportsAsRatee.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell className="text-sm">
                                                {review.cycleTitle || '---'}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={review.stage as any}
                                                />
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {review.respondedCount}/
                                                {review.respondentsCount}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/feedback360/reviews/${review.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
