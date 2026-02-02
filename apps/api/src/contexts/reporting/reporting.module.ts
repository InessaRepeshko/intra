import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { REPORT_REPOSITORY } from './application/ports/report.repository.port';
import { REPORT_ANALYTICS_REPOSITORY } from './application/ports/report-analytics.repository.port';
import { REPORT_COMMENT_REPOSITORY } from './application/ports/report-comment.repository.port';
import { ReportingService } from './application/services/reporting.service';
import { ReportAnalyticsService } from './application/services/report-analytics.service';
import { ReportCommentService } from './application/services/report-comment.service';
import { ReportRepository } from './infrastructure/prisma-repositories/report.repository';
import { ReportAnalyticsRepository } from './infrastructure/prisma-repositories/report-analytics.repository';
import { ReportCommentRepository } from './infrastructure/prisma-repositories/report-comment.repository';
import { ReportingController } from './presentation/http/controllers/reporting.controller';
import { ReportAnalyticsController } from './presentation/http/controllers/report-analytics.controller';
import { ReportCommentController } from './presentation/http/controllers/report-comment.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [
        ReportingController,
        ReportAnalyticsController,
        ReportCommentController,
    ],
    providers: [
        ReportingService,
        ReportAnalyticsService,
        ReportCommentService,
        ReportRepository,
        ReportAnalyticsRepository,
        ReportCommentRepository,
        { provide: REPORT_REPOSITORY, useExisting: ReportRepository },
        {
            provide: REPORT_ANALYTICS_REPOSITORY,
            useExisting: ReportAnalyticsRepository,
        },
        {
            provide: REPORT_COMMENT_REPOSITORY,
            useExisting: ReportCommentRepository,
        },
    ],
    exports: [
        ReportingService,
        ReportAnalyticsService,
        ReportCommentService,
    ],
})
export class ReportingModule { }
