// __tests__/src/services/RssService.test.ts
import { RssService } from '@services/RssService';
import { NewsItem } from '@models/NewsItem';
import Parser from 'rss-parser';

jest.mock('rss-parser');

describe('RssService', () => {
    let rssService: RssService;
    let parserMock: any;

    const exampleUrl = 'https://example.com/rss';

    beforeEach(() => {
        parserMock = {
            parseURL: jest.fn()
        };
        rssService = new RssService(parserMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches latest items successfully', async () => {
        const feed = {
            items: [
                {
                    title: 'Title 1',
                    content: 'Content 1',
                    category: 'Category 1',
                    link: 'link1.com',
                    pubDate: 'Date 1',
                    enclosure: { url: 'URL 1' }
                }
            ]
        };
        parserMock.parseURL.mockResolvedValue(feed);

        const result = await rssService.fetchLatestItems(exampleUrl, 'Category 1');

        expect(result).toEqual([
            expect.objectContaining({
                title: 'Title 1',
                content: 'Content 1',
                category: 'Category 1',
                pubDate: 'Date 1',
                image: 'URL 1'
            })
        ]);
        expect(parserMock.parseURL).toHaveBeenCalledWith(exampleUrl);
    });

    it('handles error when fetching RSS feed', async () => {
        parserMock.parseURL.mockRejectedValue(new Error('Failed to fetch RSS feed'));

        await expect(rssService.fetchLatestItems(exampleUrl, 'Category 1')).rejects.toThrow('Failed to fetch RSS feed');
    });

    it('throws error for invalid feed format', async () => {
        parserMock.parseURL.mockResolvedValue({});

        await expect(rssService.fetchLatestItems(exampleUrl, 'Category 2')).rejects.toThrow('Invalid feed format');
    });
});