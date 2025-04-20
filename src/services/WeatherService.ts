import { fetchWeatherApi } from 'openmeteo';
import { WeatherData } from '@models/WeatherData';
import {WeatherCodeMapper} from "@src/utils/WeatherCodeMapper";

export class WeatherService {
    private static currentWeather: WeatherData | null = null;
    params = {
        latitude: 52.1583,
        longitude: 4.4931,
        daily: ['weather_code', 'temperature_2m_max', 'precipitation_probability_max'],
        timezone: 'Europe/Berlin',
        forecast_days: 1,
    };

    async fetchAndProcessWeather(): Promise<WeatherData> {
        const url = 'https://api.open-meteo.com/v1/forecast';
        const responses = await fetchWeatherApi(url, this.params);

        const response = responses[0];
        const daily = response.daily();

        const weatherCode = daily.variables(0)!.valuesArray()![0];
        const weatherDescription = WeatherCodeMapper.getDescription(weatherCode);

        WeatherService.currentWeather = new WeatherData(
            Math.round(daily.variables(1)!.valuesArray()![0]), // Max temperature
            `${daily.variables(2)!.valuesArray()![0]}%`,  // Precipitation probability
            weatherDescription                             // Weather description
        );

        return WeatherService.currentWeather;
    }

    async getCurrentWeather(): Promise<WeatherData> {
        if (!WeatherService.currentWeather) {
            return await this.fetchAndProcessWeather().catch(error => {
                console.error('Error fetching weather data:', error);
                throw error;
            });
        } else {
            return WeatherService.currentWeather;
        }
    }
}