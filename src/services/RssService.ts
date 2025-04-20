import Parser from 'rss-parser';
import {NewsItem} from '@models/NewsItem';
import {QrCodeGeneratorService} from '@services/QrCodeGeneratorService';

export class RssService {
    private qrCodeGenerator: QrCodeGeneratorService;
    private parser: Parser;

    constructor(parser?: Parser) {
        this.parser = parser || new Parser();
        this.qrCodeGenerator = new QrCodeGeneratorService();
    }

    async fetchLatestItems(url: string, category: string): Promise<NewsItem[]> {
        const feed: any = await this.parser.parseURL(url);
        if (!feed || !feed.items) {
            throw new Error('Invalid feed format');
        }

        return await Promise.all(
            feed.items.map(async (item: any) => {
                try {
                    const validLink = this.validateAndNormalizeUrl(item.link);
                    const qrCode: string = await this.qrCodeGenerator.generateQrCode(validLink);
                    return new NewsItem(
                        item.title,
                        item.content,
                        category,
                        qrCode,
                        item.pubDate,
                        item.enclosure?.url || ''
                    );
                } catch (error) {
                    console.error(`Error generating QR code for ${item.link}:`, error);
                    throw new Error(`Error generating QR code for ${item.link}: ${error.message}`);
                }
            })
        );
    }

    private validateAndNormalizeUrl(link: string): string {
        try {
            // If the URL is valid, return it as is
            return new URL(link).toString();
        } catch {
            // If the URL is invalid, try adding a default protocol
            try {
                return new URL(`http://${link}`).toString();
            } catch {
                throw new Error(`Invalid URL: ${link}`);
            }
        }
    }
}