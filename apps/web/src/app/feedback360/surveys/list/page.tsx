"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Badge } from "@shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@shared/components/ui/avatar";
import { ClipboardList, CheckCircle, Clock, User } from "lucide-react";
import Link from "next/link";

const pendingSurveys = [
    { id: "s1", type: "peer" as const, subjectId: "u2", subjectName: "Michael Johnson", subjectRole: "Product Manager", dueDate: "2026-03-15" },
    { id: "s2", type: "peer" as const, subjectId: "u3", subjectName: "Emily Rodriguez", subjectRole: "UX Designer", dueDate: "2026-03-15" },
    { id: "s3", type: "self" as const, subjectId: "u1", subjectName: "Sarah Chen", subjectRole: "Senior Software Engineer", dueDate: "2026-03-15" },
];

const completedSurveys = [
    { id: "s4", type: "peer" as const, subjectId: "u6", subjectName: "David Kim", subjectRole: "Frontend Developer", completedDate: "2026-03-05" },
    { id: "s5", type: "peer" as const, subjectId: "u7", subjectName: "Anna Martinez", subjectRole: "Backend Developer", completedDate: "2026-03-03" },
];

export default function SurveysPage() {
    const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Surveys</h1>
                <p className="mt-1 text-muted-foreground">
                    Complete feedback surveys for your colleagues
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Surveys</p>
                                <p className="mt-1 text-3xl font-bold text-foreground">{pendingSurveys.length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/20">
                                <Clock className="h-6 w-6 text-chart-4" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="mt-1 text-3xl font-bold text-foreground">{completedSurveys.length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/20">
                                <CheckCircle className="h-6 w-6 text-chart-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Self-Assessments</p>
                                <p className="mt-1 text-3xl font-bold text-foreground">{pendingSurveys.filter(s => s.type === "self").length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                                <User className="h-6 w-6 text-chart-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2">
                <Button
                    variant={activeTab === "pending" ? "default" : "ghost"}
                    onClick={() => setActiveTab("pending")}
                    className={activeTab === "pending" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
                >
                    Pending ({pendingSurveys.length})
                </Button>
                <Button
                    variant={activeTab === "completed" ? "default" : "ghost"}
                    onClick={() => setActiveTab("completed")}
                    className={activeTab === "completed" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
                >
                    Completed ({completedSurveys.length})
                </Button>
            </div>

            {/* Survey List */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        {activeTab === "pending" ? "Pending Surveys" : "Completed Surveys"}
                    </CardTitle>
                    <CardDescription>
                        {activeTab === "pending"
                            ? "These surveys are awaiting your feedback"
                            : "Your submitted feedback surveys"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(activeTab === "pending" ? pendingSurveys : completedSurveys).map((survey) => (
                            <div
                                key={survey.id}
                                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 bg-accent">
                                        <AvatarFallback className="bg-accent text-accent-foreground">
                                            {survey.subjectName.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-foreground">{survey.subjectName}</p>
                                        <p className="text-sm text-muted-foreground">{survey.subjectRole}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            survey.type === "self"
                                                ? "border-chart-2/50 bg-chart-2/10 text-chart-2"
                                                : "border-chart-1/50 bg-chart-1/10 text-chart-1"
                                        }
                                    >
                                        {survey.type === "self" ? "Self-Assessment" : "Peer Review"}
                                    </Badge>

                                    {activeTab === "pending" ? (
                                        <>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Due</p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {new Date((survey as typeof pendingSurveys[0]).dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </p>
                                            </div>
                                            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                <Link href={`/surveys/${survey.id}?type=${survey.type}`}>
                                                    <ClipboardList className="h-4 w-4 mr-2" />
                                                    Start Survey
                                                </Link>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 text-chart-1">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm">
                                                Completed {new Date((survey as typeof completedSurveys[0]).completedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
