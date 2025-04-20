import { AdditionalData } from '@models/AdditionalData';
import { WeatherService } from '@services/WeatherService';
import * as fs from 'fs';

jest.mock('@services/WeatherService');
jest.mock('fs');

describe('AdditionalData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('loadVolume', () => {
        it('should load volume from file if it exists', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            (fs.readFileSync as jest.Mock).mockReturnValue('42');

            const volume = (AdditionalData as any).loadVolume();

            expect(volume).toBe(42);
            expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('volume.txt'), 'utf8');
        });

        it('should return 0 if the file does not exist', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            const volume = (AdditionalData as any).loadVolume();

            expect(volume).toBe(0);
        });
    });

    describe('incrementVolume', () => {
        it('should increment the volume and save it to the file', () => {
            (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

            const initialVolume = (AdditionalData as any).currentVolume;
            const newVolume = (AdditionalData as any).incrementVolume();

            expect(newVolume).toBe(initialVolume + 1);
            expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('volume.txt'), newVolume.toString(), 'utf8');
        });
    });

    describe('initialize', () => {
        it('should fetch and set weather data', async () => {
            const mockWeatherData = { temperature: 25, condition: 'Sunny' };
            (WeatherService.prototype.getCurrentWeather as jest.Mock).mockResolvedValue(mockWeatherData);

            const additionalData = new AdditionalData();
            await additionalData.initialize();

            expect(additionalData.weather).toEqual(mockWeatherData);
            expect(WeatherService.prototype.getCurrentWeather).toHaveBeenCalled();
        });

        it('should set weather to null if fetching fails', async () => {
            (WeatherService.prototype.getCurrentWeather as jest.Mock).mockRejectedValue(new Error('API error'));

            const additionalData = new AdditionalData();
            await additionalData.initialize();

            console.log(additionalData.weather)
            expect(additionalData.weather).toBeNull();
        });
    });
});