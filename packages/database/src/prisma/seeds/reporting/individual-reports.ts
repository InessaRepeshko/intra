import { spawn } from 'node:child_process';

/**
 * Seeds individual reports for all reviews in cycles 1 and 2 by delegating to
 * the NestJS bootstrap script in apps/api. The script resolves the full DI
 * graph and uses ReportingService.generateReportForReview, so analytics,
 * insights and cluster scores are produced through the same code path that
 * runs in production.
 */
export default async function seedIndividualReports(): Promise<void> {
    await runScript('seed:individual-reports');
}

function runScript(packageScript: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn('pnpm', ['--filter', '@intra/api', packageScript], {
            stdio: 'inherit',
            shell: process.platform === 'win32',
        });

        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(
                        `Script "${packageScript}" exited with code ${code}`,
                    ),
                );
            }
        });
    });
}
