import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from 'src/contexts/feedback360/application/ports/review.repository.port';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';

const TARGET_CYCLE_IDS = [1, 2];

async function seedIndividualReports(): Promise<void> {
    const logger = new Logger('seed-individual-reports');
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: ['error', 'warn', 'log'],
    });

    try {
        const reviewsRepo = app.get<ReviewRepositoryPort>(REVIEW_REPOSITORY);
        const reportingService = app.get(ReportingService);

        let totalCreated = 0;
        let totalSkipped = 0;
        let totalFailed = 0;

        for (const cycleId of TARGET_CYCLE_IDS) {
            const reviews = await reviewsRepo.search({ cycleId });
            logger.log(
                `Cycle ${cycleId}: found ${reviews.length} reviews to process`,
            );

            for (const review of reviews) {
                if (!review.id) continue;

                try {
                    if (review.reportId) {
                        totalSkipped += 1;
                        continue;
                    }

                    await reportingService.generateReportForReview(review.id);
                    totalCreated += 1;
                } catch (err) {
                    totalFailed += 1;
                    logger.warn(
                        `Failed to generate report for review ${review.id}: ${
                            err instanceof Error ? err.message : String(err)
                        }`,
                    );
                }
            }
        }

        logger.log(
            `Individual reports — created: ${totalCreated}, skipped: ${totalSkipped}, failed: ${totalFailed}`,
        );
    } finally {
        await app.close();
    }
}

seedIndividualReports()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
