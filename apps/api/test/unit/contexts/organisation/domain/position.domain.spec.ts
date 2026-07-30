import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';

describe('PositionDomain', () => {
    const baseProps = { title: 'Engineer' };

    describe('create', () => {
        it('creates a position with every supplied property', () => {
            const position = PositionDomain.create({
                id: 1,
                title: 'Engineer',
                description: 'Software engineer',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(position.id).toBe(1);
            expect(position.title).toBe('Engineer');
            expect(position.description).toBe('Software engineer');
            expect(position.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(position.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('normalises missing description to null', () => {
            const position = PositionDomain.create(baseProps);
            expect(position.description).toBeNull();
        });

        it('preserves explicit null description', () => {
            const position = PositionDomain.create({
                ...baseProps,
                description: null,
            });
            expect(position.description).toBeNull();
        });
    });

    describe('withPatch', () => {
        it('returns a new instance carrying the supplied patch', () => {
            const position = PositionDomain.create({
                id: 1,
                title: 'Engineer',
                description: 'Old',
            });

            const next = position.withPatch({ description: 'New' });

            expect(next).not.toBe(position);
            expect(next.title).toBe('Engineer');
            expect(next.description).toBe('New');
            expect(position.description).toBe('Old');
        });
    });
});
