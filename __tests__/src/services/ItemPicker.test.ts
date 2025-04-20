// __tests__/src/services/ItemPicker.test.ts
import { ItemPicker } from '@services/ItemPicker';
import { NewsItem } from '@models/NewsItem';
import { StorageService } from '@services/StorageService';

jest.mock('@services/StorageService');

describe('ItemPicker', () => {
    let itemPicker: ItemPicker;
    let storageServiceMock: jest.Mocked<StorageService>;

    beforeEach(() => {
        storageServiceMock = new StorageService('mockFile.json') as jest.Mocked<StorageService>;
        storageServiceMock.readSeenTitles.mockReturnValue([]);
        storageServiceMock.writeSeenTitles.mockImplementation(() => {});

        itemPicker = new ItemPicker(storageServiceMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('chooseMainStory chooses the first unseen main story from politiek', () => {
        const politiek = [new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1')];
        const formule1: NewsItem[] = [];
        const schaatsen: NewsItem[] = [];
        const algemeen: NewsItem[] = [];

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title1');
    });

    it('chooseMainStory chooses the first unseen main story from formule1 if no unseen in politiek', () => {
        const politiek: NewsItem[] = [];
        const formule1 = [new NewsItem('title2', 'content2', 'formule1', 'link2', 'pubDate2', 'image2')];
        const schaatsen: NewsItem[] = [];
        const algemeen: NewsItem[] = [];

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title2');
    });

    it('chooseMainStory chooses the first unseen main story from schaatsen if no unseen in politiek and formule1', () => {
        const politiek: NewsItem[] = [];
        const formule1: NewsItem[] = [];
        const schaatsen = [new NewsItem('title3', 'content3', 'schaatsen', 'link3', 'pubDate3', 'image3')];
        const algemeen: NewsItem[] = [];

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title3');
    });

    it('chooseMainStory chooses the first unseen main story from algemeen if no unseen in politiek, formule1, and schaatsen', () => {
        const politiek: NewsItem[] = [];
        const formule1: NewsItem[] = [];
        const schaatsen: NewsItem[] = [];
        const algemeen = [new NewsItem('title4', 'content4', 'algemeen', 'link4', 'pubDate4', 'image4')];

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title4');
    });

    it('chooseMainStory returns the first item from politiek if all categories are empty', () => {
        const politiek = [new NewsItem('title5', 'content5', 'politiek', 'link5', 'pubDate5', 'image5')];
        const formule1: NewsItem[] = [];
        const schaatsen: NewsItem[] = [];
        const algemeen: NewsItem[] = [];

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title5');
    });

    it('chooseMainStory chooses the second story from politiek if the first is seen', () => {
        const politiek = [
            new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1'),
            new NewsItem('title2', 'content2', 'politiek', 'link2', 'pubDate2', 'image2')
        ];
        const formule1: NewsItem[] = [];
        const schaatsen: NewsItem[] = [];
        const algemeen: NewsItem[] = [];

        storageServiceMock.readSeenTitles.mockReturnValue(['title1']);

        // Re-instantiate ItemPicker after setting up the mock
        itemPicker = new ItemPicker(storageServiceMock);

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title2');
    });

    it('chooseMainStory chooses the first story from politiek if all others are seen', () => {
        const politiek = [
            new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1'),
            new NewsItem('title2', 'content2', 'politiek', 'link2', 'pubDate2', 'image2')
        ];
        const formule1: NewsItem[] = [
            new NewsItem('title3', 'content3', 'formule1', 'link3', 'pubDate3', 'image3')
        ];
        const schaatsen: NewsItem[] = [];
        const algemeen: NewsItem[] = [];

        storageServiceMock.readSeenTitles.mockReturnValue(['title1', 'title2', 'title3']);

        // Re-instantiate ItemPicker after setting up the mock
        itemPicker = new ItemPicker(storageServiceMock);

        const mainStory = itemPicker.chooseMainStory(politiek, formule1, schaatsen, algemeen);

        expect(mainStory.title).toBe('title1');
    });

    it('chooseSubStories returns formule1 and schaatsen items if main story is from politiek', () => {
        const mainStory = new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1');
        const politiek: NewsItem[] = [
            new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1')
        ];
        const formule1 = [
            new NewsItem('title2', 'content2', 'formule1', 'link2', 'pubDate2', 'image2'),
            new NewsItem('title3', 'content3', 'formule1', 'link3', 'pubDate3', 'image3')
        ];
        const schaatsen: NewsItem[] = [
            new NewsItem('title4', 'content4', 'schaatsen', 'link4', 'pubDate4', 'image4')
        ];
        const algemeen: NewsItem[] = [];

        const subStories = itemPicker.chooseSubStories(mainStory, politiek, formule1, schaatsen, algemeen);

        expect(subStories.length).toBe(2);
        expect(subStories[0].title).toBe('title2');
        expect(subStories[1].title).toBe('title4');
    });

    it('chooseSubStories returns formule1 and algemeen items if schaatsen is empty', () => {
        const mainStory = new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1');
        const politiek: NewsItem[] = [
            new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1')
        ];
        const formule1 = [
            new NewsItem('title2', 'content2', 'formule1', 'link2', 'pubDate2', 'image2'),
            new NewsItem('title3', 'content3', 'formule1', 'link3', 'pubDate3', 'image3')
        ];
        const schaatsen: NewsItem[] = [];
        const algemeen: NewsItem[] = [
            new NewsItem('title4', 'content4', 'schaatsen', 'link4', 'pubDate4', 'image4')
        ];

        const subStories = itemPicker.chooseSubStories(mainStory, politiek, formule1, schaatsen, algemeen);

        expect(subStories.length).toBe(2);
        expect(subStories[0].title).toBe('title2');
        expect(subStories[1].title).toBe('title4');
    });

    it('pickItems returns a FrontPage object with main and sub stories', async () => {
        const items: NewsItem[] = [
            new NewsItem('title1', 'content1', 'politiek', 'link1', 'pubDate1', 'image1'),
            new NewsItem('title2', 'content2', 'formule1', 'link2', 'pubDate2', 'image2'),
            new NewsItem('title3', 'content3', 'schaatsen', 'link3', 'pubDate3', 'image3'),
            new NewsItem('title4', 'content4', 'algemeen', 'link4', 'pubDate4', 'image4')
        ];
        const seenTitles: string[] = ['title1'];

        storageServiceMock.readSeenTitles.mockReturnValue(seenTitles);

        // Re-instantiate ItemPicker after setting up the mock
        itemPicker = new ItemPicker(storageServiceMock);

        const frontPage = await itemPicker.pickItems([items[0]], [items[1]], [items[2]], [items[3]]);

        expect(frontPage.mainStory.title).toBe('title2');
        expect(frontPage.subStories.length).toBe(2);
    });

    it('pickItems returns empty frontPage if stories are empty', async () => {
        const items: NewsItem[] = [];
        const seenTitles: string[] = ['title2'];

        storageServiceMock.readSeenTitles.mockReturnValue(seenTitles);

        // Re-instantiate ItemPicker after setting up the mock
        itemPicker = new ItemPicker(storageServiceMock);

        const frontPage = await itemPicker.pickItems(items, [], [], []);

        expect(frontPage.mainStory).toBeUndefined()
        expect(frontPage.subStories.length).toBe(0);
    });
});