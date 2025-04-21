// src/services/HtmlService.ts

import {FrontPage} from '@models/FrontPage';
import * as fs from 'fs';
import * as path from 'path';

export class HtmlService {
    generateHtml(items: FrontPage): string {
        const templatePath = path.join(__dirname, '../templates/template.html');
        const cssPath = path.join(__dirname, '../templates/style.css');

        let html = fs.readFileSync(templatePath, 'utf8');
        const css = fs.readFileSync(cssPath, 'utf8');

        const fullContent = items.mainStory.content;

        function cropAndSplitStory(content: string, wordLimit: number, columnDif: number): Array<string> {
            console.log("content: ", content)
            const imageWeightEstimate = 0; // Approximate "height cost" of the image in words
            const croppedContent = cropContentAtWordCount(content, wordLimit);

            // Simple word-based estimate: split at ~40% for left column (title + content)
            const words = croppedContent.split(' ');
            const totalWords = words.length;

            const paragraphRegex = /<p>.*?<\/p>/g;
            let paragraphs = croppedContent.match(paragraphRegex) || [];
            let leftContent = '';
            let rightContent = '';
            let wordCount = 0;
            // split the columns on a </p> tag
            const wordsForLeft = Math.floor((totalWords + imageWeightEstimate) * columnDif);
            // Split the content into two parts

            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i];
                const paragraphWords = paragraph.split(' ').length;

                if (wordCount + paragraphWords > wordsForLeft) {
                    // Assign remaining paragraphs to the right column
                    rightContent = paragraphs.slice(i).join('');
                    break;
                }

                leftContent += paragraph;
                wordCount += paragraphWords;
            }

            rightContent += '<p>Lees meer op pagina 3</p>';
            return [leftContent, rightContent];
        }

        function cropContentAtWordCount(content: string, wordLimit: number): string {
            const paragraphRegex = /<\/p>/g;
            let paragraphs = content.split(paragraphRegex);
            let croppedContent = '';
            let wordCount = 0;

            for (const paragraph of paragraphs) {
                const paragraphWords = paragraph.split(' ').length;

                if (wordCount + paragraphWords > wordLimit) {
                    break;
                }

                croppedContent += paragraph + '</p>';
                wordCount += paragraphWords;
            }
            return croppedContent;
        }

        const sub1CroppedContent = cropContentAtWordCount(items.subStories[0].content, 150);
        const sub2CroppedContent = cropContentAtWordCount(items.subStories[1].content, 150);

        const columns = cropAndSplitStory(fullContent, 300, 0.53);

        html = html.replace('{{css}}', `<style>${css}</style>`);

        html = html.replace('{{volumeNumber}}', items.additionalData.volume.toString());
        html = html.replace('{{weatherData}}', items.additionalData.weather?.maxTemp.toString() + "°C - " + items.additionalData.weather?.weatherCode);

        html = html.replace('{{mainStoryTitle}}', items.mainStory.title);
        html = html.replace('{{mainImage}}', items.mainStory.image);
        html = html.replace('{{leftContent}}', columns[0]);
        html = html.replace('{{rightContent}}', columns[1]);

        html = html.replace('{{subStory1Title}}', items.subStories[0].title);
        html = html.replace('{{subStory1Image}}', items.subStories[0].image);
        html = html.replace('{{subContent1}}', sub1CroppedContent);

        html = html.replace('{{subStory2Title}}', items.subStories[1].title);
        html = html.replace('{{subStory2Image}}', items.subStories[1].image);
        html = html.replace('{{subContent2}}', sub2CroppedContent);

        html = html.replace('{{currentDate}}', new Date().toLocaleDateString('nl-NL'));

        html = html.replace('{{qrMain}}', items.mainStory.qrCode);
        html = html.replace('{{qrSub1}}', items.subStories[0].qrCode);
        html = html.replace('{{qrSub2}}', items.subStories[1].qrCode);

        // html = html.replace('{{subStories}}', subStoriesHtml);


        return html;
    }
}