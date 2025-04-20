// src/app.ts
require('module-alias/register');
import express from 'express';
import { RssService } from '@services/RssService';
import { HtmlService } from './services/HtmlService';
import { ImageService } from './services/ImageService';
import { Scheduler } from './utils/Scheduler';
import { ItemPicker } from './services/ItemPicker';
import { NewsItem } from './models/NewsItem';
import { FrontPage } from './models/FrontPage';
import { StorageService } from './services/StorageService';

const app = express();
const port = 3000;

const storageService = new StorageService('seenTitles.json');
const rssService = new RssService();
const htmlService = new HtmlService();
const itemPicker = new ItemPicker(storageService);
const imageService = new ImageService();

app.get('/', async (req, res) => {
    try {
        const politiekItems: NewsItem[] = await rssService.fetchLatestItems('https://feeds.nos.nl/nosnieuwspolitiek', 'Politiek');
        const formule1Items: NewsItem[] = await rssService.fetchLatestItems('https://feeds.nos.nl/nossportformule1', 'Formule 1');
        const schaatsenItems: NewsItem[] = await rssService.fetchLatestItems('https://feeds.nos.nl/nossportschaatsen', 'Schaatsen');
        const algemeenItems: NewsItem[] = await rssService.fetchLatestItems('https://feeds.nos.nl/nosnieuwsalgemeen', 'Algemeen');

        const frontPage: FrontPage = await itemPicker.pickItems(politiekItems, formule1Items, schaatsenItems, algemeenItems);
        const html = htmlService.generateHtml(frontPage);

        // Render the HTML to an image
        const outputPath = 'src/images/output.png';
        await imageService.renderHtmlToImage(html, outputPath);

        res.send(html); // Send the generated HTML to the browser
    } catch (error) {
        console.error('Error processing RSS feed:', error);
        res.status(500).send('An error occurred while generating the page.');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});