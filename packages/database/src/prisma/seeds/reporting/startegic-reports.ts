import { spawn } from 'node:child_process';

/**
 * Seeds strategic reports for cycles 1 and 2 by delegating to the NestJS
 * bootstrap script in apps/api. The script resolves the full DI graph and
 * uses StrategicReportingService.generateStrategicReportForCycle, so the
 * resulting strategic report aggregates the same analytics and insights that
 * are produced in production.
 */
export default async function seedStrategicReports(): Promise<void> {
    await runScript('seed:strategic-reports');
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
