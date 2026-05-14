import { NotificationKind } from 'src/contexts/notifications/domain/notification-kind.enum';

describe('NotificationKind', () => {
    it('exposes the expected notification kinds with string values matching the keys', () => {
        expect(NotificationKind.RATEE_SELF_ASSESSMENT).toBe(
            'RATEE_SELF_ASSESSMENT',
        );
        expect(NotificationKind.RESPONDENT_INVITATION).toBe(
            'RESPONDENT_INVITATION',
        );
        expect(NotificationKind.HR_REPORT_READY).toBe('HR_REPORT_READY');
        expect(NotificationKind.REVIEWER_REPORT_READY).toBe(
            'REVIEWER_REPORT_READY',
        );
        expect(NotificationKind.CYCLE_STRATEGIC_REPORT_READY).toBe(
            'CYCLE_STRATEGIC_REPORT_READY',
        );
        expect(NotificationKind.USER_WELCOME).toBe('USER_WELCOME');
    });
});
