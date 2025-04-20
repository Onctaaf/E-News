// __tests__/src/services/StorageService.test.ts
import { StorageService } from '@services/StorageService';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('StorageService', () => {
    let storageService: StorageService;
    const fileName = 'seenTitles.json';
    const filePath = '/mocked/path/seenTitles.json';

    beforeEach(() => {
        (path.resolve as jest.Mock).mockReturnValue(filePath);
        storageService = new StorageService(fileName);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('reads seen titles successfully', () => {
        const titles = ['Title 1', 'Title 2'];
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(titles));

        const result = storageService.readSeenTitles();

        expect(result).toEqual(titles);
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('returns empty array if file does not exist', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const result = storageService.readSeenTitles();

        expect(result).toEqual([]);
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it('returns empty array if file is empty', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue('');

        const result = storageService.readSeenTitles();

        expect(result).toEqual([]);
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('writes seen titles successfully', () => {
        const titles = ['Title 1', 'Title 2'];

        storageService.writeSeenTitles(titles);

        expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, JSON.stringify(titles, null, 2), 'utf-8');
    });
});