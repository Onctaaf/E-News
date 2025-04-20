export class NewsItem {
    constructor(
        title: string,
        content: string,
        category: string,
        qrCode: string,
        pubDate: string,
        image: string,
    ) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.qrCode = qrCode;
        this.pubDate = pubDate;
        this.image = image;
    }

    title: string
    content: string
    category: string
    qrCode: string
    pubDate: string
    image: string
}