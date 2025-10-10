// src/services/ItemPicker.ts
import {StorageService} from './StorageService';
import {NewsItem} from "@models/NewsItem";
import {FrontPage} from "@models/FrontPage";
import {AdditionalData} from "@models/AdditionalData";

export class ItemPicker {

    private storageService: StorageService;
    private readonly seenTitles: string[];

    constructor(storageService: StorageService) {
        this.storageService = new StorageService('seenTitles.json');
        this.seenTitles = storageService.readSeenTitles() || [];
    }

    async pickItems(
        politiek: NewsItem[],
        formule1: NewsItem[],
        schaatsen: NewsItem[],
        algemeen: NewsItem[],
    ): Promise<FrontPage> {
        let mainStory = this.chooseMainStory(politiek, formule1, schaatsen, algemeen);
        let subStories = this.chooseSubStories(mainStory, politiek, formule1, schaatsen, algemeen);

        let additionalData = new AdditionalData();
        await additionalData.initialize(); // Ensure weather data is fetched

        return new FrontPage(mainStory, subStories, additionalData);
    }

    chooseMainStory(politiek: NewsItem[], formule1: NewsItem[], schaatsen: NewsItem[], algemeen: NewsItem[]): NewsItem {
        let mainStory: NewsItem | null = null;
        const newPolitiek = politiek.filter(item => !this.seenTitles.includes(item.title));
        if (newPolitiek.length > 0) {
            mainStory = newPolitiek[0];
        } else {
            const newFormule1 = formule1.filter(item => !this.seenTitles.includes(item.title));
            if (newFormule1.length > 0) {
                mainStory = newFormule1[0];
            } else {
                const newSchaatsen = schaatsen.filter(item => !this.seenTitles.includes(item.title));
                if (newSchaatsen.length > 0) {
                    mainStory = newSchaatsen[0];
                } else {
                    const newAlgemeen = algemeen.filter(item => !this.seenTitles.includes(item.title));
                    if (newAlgemeen.length > 0) {
                        mainStory = newAlgemeen[0];
                    } else {
                        mainStory = politiek[0];
                    }
                }
            }
        }

        if (mainStory) {
            //todo: uncomment this
            this.seenTitles.push(mainStory.title);
            this.storageService.writeSeenTitles(this.seenTitles);
        }

        return mainStory;
    }

    chooseSubStories(mainStory: NewsItem, politiek: NewsItem[], formule1: NewsItem[], schaatsen: NewsItem[], algemeen: NewsItem[]): NewsItem[] {
        const categories = [politiek, formule1, schaatsen, algemeen];
        const subStories: NewsItem[] = [];
        const addedCategories = new Set<string>();
        console.log(politiek.length, formule1.length, schaatsen.length, algemeen.length);

        for (const category of categories) {
            if (subStories.length >= 2) break;
            const notAlreadySeen = category.filter(item => !this.seenTitles.includes(item.title));
            // console.log('notAlreadySeen', notAlreadySeen.length);
            const notMainCat = notAlreadySeen.filter(item => item.category !== mainStory.category);
            // console.log('notMainCat', notMainCat.length);
            const newItems = notMainCat.filter(item => !addedCategories.has(item.category));
            // console.log('newItems', newItems.length);
            // const newItems = category.filter(item => !this.seenTitles.includes(item.title) && item.category !== mainStory.category && !addedCategories.has(item.category));
            if (newItems.length > 0) {
                subStories.push(newItems[0]);
                addedCategories.add(newItems[0].category);
            }
        }

        // todo: uncomment this
        // this.seenTitles.push(...subStories.map(item => item.title));
        // this.storageService.writeSeenTitles(this.seenTitles);

        return subStories;
    }
}
