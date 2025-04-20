// src/services/StorageService.ts
import * as fs from 'fs';
import * as path from 'path';

export class StorageService {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.resolve(__dirname, fileName);
    }

    readSeenTitles(): string[] {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
    }

    writeSeenTitles(titles: string[]): void {
        fs.writeFileSync(this.filePath, JSON.stringify(titles, null, 2), 'utf-8');
    }
}