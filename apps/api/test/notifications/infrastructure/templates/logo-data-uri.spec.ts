import {
    LOGO_BUFFER,
    LOGO_CID,
    LOGO_CONTENT_TYPE,
    LOGO_DATA_URI,
    LOGO_FILENAME,
} from 'src/contexts/notifications/infrastructure/templates/logo-data-uri';

describe('logo-data-uri', () => {
    it('exposes the canonical CID and filename', () => {
        expect(LOGO_CID).toBe('intra-logo');
        expect(LOGO_FILENAME).toBe('intra-logo.png');
        expect(LOGO_CONTENT_TYPE).toBe('image/png');
    });

    it('encodes a PNG data URI matching the buffer', () => {
        expect(LOGO_DATA_URI.startsWith('data:image/png;base64,')).toBe(true);

        const base64 = LOGO_DATA_URI.split(',')[1];
        const decoded = Buffer.from(base64, 'base64');
        expect(decoded.equals(LOGO_BUFFER)).toBe(true);
    });

    it('starts the decoded buffer with the PNG magic header', () => {
        // \x89PNG\r\n\x1a\n
        const header = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        ]);
        expect(LOGO_BUFFER.slice(0, 8).equals(header)).toBe(true);
    });
});
