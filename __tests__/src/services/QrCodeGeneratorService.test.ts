import {QrCodeGeneratorService} from "@services/QrCodeGeneratorService";

describe('QrCodeGeneratorService', () => {

    it('should generate a QR code and return an img tag', async () => {
        const qrCodeGeneratorService = new QrCodeGeneratorService();
        const url = 'https://example.com';

        const imgTag = await qrCodeGeneratorService.generateQrCode(url);

        expect(imgTag).toContain('<img class="qrCode" src="data:image/png;base64,');
    });

    it('should throw an error if the URL is invalid', async () => {
        const qrCodeGeneratorService = new QrCodeGeneratorService();
        const invalidUrl = 'invalid-url';

        await expect(qrCodeGeneratorService.generateQrCode(invalidUrl)).rejects.toThrow('Invalid URL');
    });

    it('should reject with an error if qrCode.toDataURL fails', async () => {
        const qrCode = require('qrcode');
        const toDataURLSpy = jest.spyOn(qrCode, 'toDataURL').mockImplementation(
            (_: string, __: object, callback: (error: Error | null, url: string | null) => void) => {
                const mockError = new Error('QR code generation failed');
                callback(mockError, null); // Simulate an error
            }
        );

        const qrCodeGeneratorService = new QrCodeGeneratorService();
        const url = 'https://example.com';

        await expect(qrCodeGeneratorService.generateQrCode(url)).rejects.toThrow('QR code generation failed');

        toDataURLSpy.mockRestore(); // Restore the original implementation after the test
    });

    it('should reject with an error if require(qrcode) throws', async () => {
        jest.doMock('qrcode', () => {
            throw new Error('Failed to load qrcode module');
        });

        const QrCodeGeneratorService = require('@services/QrCodeGeneratorService').QrCodeGeneratorService;
        const qrCodeGeneratorService = new QrCodeGeneratorService();
        const url = 'https://example.com';

        await expect(qrCodeGeneratorService.generateQrCode(url)).rejects.toThrow('Failed to load qrcode module');

        jest.dontMock('qrcode'); // Clean up the mock after the test
    });
});