import {NewsItem} from "./NewsItem";
import {AdditionalData} from "@models/AdditionalData";

export class FrontPage {
    constructor(
        mainStory: NewsItem,
        subStories: NewsItem[],
        additionalData: AdditionalData,
    ) {
        this.mainStory = mainStory;
        this.subStories = subStories;
        this.additionalData = additionalData;
    }

    mainStory: NewsItem;
    subStories: NewsItem[];
    additionalData: AdditionalData;
}