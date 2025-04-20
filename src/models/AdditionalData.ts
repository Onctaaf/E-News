import * as fs from 'fs';
import * as path from 'path';
import { WeatherService } from '@services/WeatherService';
import { WeatherData } from '@models/WeatherData';

export class AdditionalData {
    private static volumeFilePath = path.join(__dirname, '../services/volume.txt');
    private static currentVolume: number = AdditionalData.loadVolume();

    weather: WeatherData | null = null;
    volume: number;

    constructor() {
        this.volume = AdditionalData.incrementVolume();
    }

    async initialize(): Promise<void> {
        const weatherService = new WeatherService();
        try {
            this.weather = await weatherService.getCurrentWeather();
        } catch (error) {
            this.weather = null;
            console.error('Failed to fetch weather data:', error);
        }
    }

    private static loadVolume(): number {
        if (fs.existsSync(this.volumeFilePath)) {
            const data = fs.readFileSync(this.volumeFilePath, 'utf8');
            return parseInt(data, 10) || 0;
        }
        return 0;
    }

    private static saveVolume(): void {
        fs.writeFileSync(this.volumeFilePath, this.currentVolume.toString(), 'utf8');
    }

    private static incrementVolume(): number {
        this.currentVolume++;
        this.saveVolume();
        return this.currentVolume;
    }
}