// src/services/ImageService.ts
import puppeteer from 'puppeteer';

export class ImageService {
    async renderHtmlToImage(html: string, outputPath: string) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();



        await page.setViewport({ width: 2160, height: 3060 });
        await page.setContent(html);

        await page.waitForSelector('#articleImage');

        await page.screenshot({ path: outputPath, fullPage: true });
        await browser.close();
    }
}