export class WeatherData {
    constructor(
        maxTemp: number,
        precipitation: string,
        weatherCode: string,
    ) {
        this.maxTemp = maxTemp;
        this.precipitation = precipitation;
        this.weatherCode = weatherCode;
    }

    maxTemp: number
    precipitation: string
    weatherCode: string
}