import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { REPORT_REPOSITORY } from './application/ports/report.repository.port';
import { ReportingService } from './application/services/reporting.service';
import { ReportRepository } from './infrastructure/prisma-repositories/report.repository';
import { ReportingController } from './presentation/http/controllers/reporting.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ReportingController],
    providers: [
        ReportingService,
        ReportRepository,
        { provide: REPORT_REPOSITORY, useExisting: ReportRepository },
    ],
    exports: [ReportingService],
})
export class ReportingModule {}
