import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';

const TARGET_CYCLE_IDS = [1, 2];

async function seedStrategicReports(): Promise<void> {
    const logger = new Logger('seed-strategic-reports');
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: ['error', 'warn', 'log'],
    });

    try {
        const strategicReportingService = app.get(StrategicReportingService);

        let totalCreated = 0;
        let totalSkipped = 0;
        let totalFailed = 0;

        for (const cycleId of TARGET_CYCLE_IDS) {
            try {
                const existing = await strategicReportingService
                    .getByCycleId(cycleId)
                    .catch(() => null);

                if (existing) {
                    logger.log(
                        `Strategic report for cycle ${cycleId} already exists — skipping`,
                    );
                    totalSkipped += 1;
                    continue;
                }

                await strategicReportingService.generateStrategicReportForCycle(
                    cycleId,
                );
                totalCreated += 1;
                logger.log(`Generated strategic report for cycle ${cycleId}`);
            } catch (err) {
                totalFailed += 1;
                logger.warn(
                    `Failed to generate strategic report for cycle ${cycleId}: ${
                        err instanceof Error ? err.message : String(err)
                    }`,
                );
            }
        }

        logger.log(
            `Strategic reports — created: ${totalCreated}, skipped: ${totalSkipped}, failed: ${totalFailed}`,
        );
    } finally {
        await app.close();
    }
}

seedStrategicReports()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
