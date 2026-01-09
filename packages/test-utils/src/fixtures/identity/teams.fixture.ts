import { teamBuilder } from "@test-utils/builders/identity/team.builder";


export const teamsFixture = () => {
    const hr = teamBuilder({ title: 'HR Department', description: 'Human Resources Department' });
    const dev = teamBuilder({ title: 'Development Department', description: 'Development Department' });
    const qa = teamBuilder({ title: 'QA Department', description: 'QA Department' });

    return { hr, dev, qa };
}
