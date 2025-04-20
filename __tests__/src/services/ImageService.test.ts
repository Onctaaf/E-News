import { ImageService } from '@services/ImageService';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ImageService', () => {
    let imageService: ImageService;
    let browserMock: any;
    let pageMock: any;

    beforeEach(() => {
        imageService = new ImageService();
        browserMock = {
            newPage: jest.fn(),
            close: jest.fn()
        };
        pageMock = {
            setViewport: jest.fn(),
            setContent: jest.fn(),
            waitForSelector: jest.fn(), // Mock waitForSelector
            screenshot: jest.fn().mockResolvedValue(Buffer.from(''))
        };
        (puppeteer.launch as jest.Mock).mockResolvedValue(browserMock);
        browserMock.newPage.mockResolvedValue(pageMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders HTML to image successfully', async () => {
        const html = '<html lang="nl"><body>Hello World</body></html>';
        const outputPath = 'output.png';

        await imageService.renderHtmlToImage(html, outputPath);

        expect(puppeteer.launch).toHaveBeenCalled();
        expect(browserMock.newPage).toHaveBeenCalled();
        expect(pageMock.setContent).toHaveBeenCalledWith(html);
        expect(pageMock.screenshot).toHaveBeenCalledWith({ path: outputPath, fullPage: true }); // Include fullPage: true
        expect(browserMock.close).toHaveBeenCalled();
    });

    it('handles error when launching browser', async () => {
        (puppeteer.launch as jest.Mock).mockRejectedValue(new Error('Failed to launch browser'));

        await expect(imageService.renderHtmlToImage('<html lang="nl"></html>', 'output.png')).rejects.toThrow('Failed to launch browser');
    });

    it('handles error when setting page content', async () => {
        pageMock.setContent.mockRejectedValue(new Error('Failed to set content'));

        await expect(imageService.renderHtmlToImage('<html lang="nl"></html>', 'output.png')).rejects.toThrow('Failed to set content');
    });

    it('handles error when taking screenshot', async () => {
        pageMock.screenshot.mockRejectedValue(new Error('Failed to take screenshot'));

        await expect(imageService.renderHtmlToImage('<html lang="nl"></html>', 'output.png')).rejects.toThrow('Failed to take screenshot');
    });
});