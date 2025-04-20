// File: src/utils/__tests__/WeatherCodeMapper.test.ts
import { WeatherCodeMapper } from '@utils/WeatherCodeMapper';

describe('WeatherCodeMapper', () => {
    test('should return correct description for valid weather codes', () => {
        expect(WeatherCodeMapper.getDescription(0)).toBe('Zonnig');
        expect(WeatherCodeMapper.getDescription(1)).toBe('Overwegend zonnig');
        expect(WeatherCodeMapper.getDescription(95)).toBe('Onweersbuien');
        expect(WeatherCodeMapper.getDescription(99)).toBe('Onweersbuien met zware hagel');
    });

    test('should return "Unknown weather condition" for invalid weather codes', () => {
        expect(WeatherCodeMapper.getDescription(999)).toBe('Unknown weather condition');
        expect(WeatherCodeMapper.getDescription(-1)).toBe('Unknown weather condition');
        expect(WeatherCodeMapper.getDescription(100)).toBe('Unknown weather condition');
    });

    test('should handle string input gracefully', () => {
        // @ts-ignore: Testing invalid input
        expect(WeatherCodeMapper.getDescription('invalid')).toBe('Unknown weather condition');
    });
});