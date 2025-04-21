import { WeatherService } from '@services/WeatherService';
import { fetchWeatherApi } from 'openmeteo';

// Mock the `fetchWeatherApi` function
jest.mock('openmeteo', () => ({
    fetchWeatherApi: jest.fn(),
}));

describe('WeatherService', () => {
    let weatherService: WeatherService;

    beforeEach(() => {
        weatherService = new WeatherService();
        (WeatherService as any).currentWeather = undefined; // Reset the static property
    });

    it('should fetch and process weather data correctly', async () => {
        // Mock API response
        const mockResponse = [
            {
                utcOffsetSeconds: () => 3600,
                daily: () => ({
                    time: () => 1672531200,
                    timeEnd: () => 1672617600,
                    interval: () => 86400,
                    variables: (index: number) => ({
                        valuesArray: () => {
                            if (index === 0) return [1];
                            if (index === 1) return [10];
                            if (index === 2) return [50];
                            return [];
                        },
                    }),
                }),
            },
        ];

        (fetchWeatherApi as jest.Mock).mockResolvedValue(mockResponse);

        await weatherService.fetchAndProcessWeather();

        const currentWeather = await weatherService.getCurrentWeather(); // Await the result

        expect(currentWeather).toEqual({
            maxTemp: 10,
            precipitation: '50%',
            weatherCode: 'Overwegend zonnig',
        });
    });

    it('should throw an error if no weather data is fetched', async () => {
        // Mock `fetchWeatherApi` to reject with an error
        (fetchWeatherApi as jest.Mock).mockRejectedValue(new Error('API error'));

        await expect(weatherService.getCurrentWeather()).rejects.toThrow('API error');
    });

    afterAll(() => {
        jest.clearAllMocks(); // Clear mocks to avoid interference between tests
    });
});