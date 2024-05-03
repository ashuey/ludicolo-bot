import {Forecast} from "@/modules/ffxiv/Forecast";
import EorzeaWeather from "eorzea-weather";

describe('Forecast', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('finds the correct next weather time', () => {
        jest.setSystemTime(1714747691000) // Fri May 03 2024 14:48:11 GMT+0000

        const expectedTime = 1714753600000 // Fri May 03 2024 16:26:40 GMT+0000

        const f = new Forecast(EorzeaWeather.ZONE_EUREKA_HYDATOS);

        const nextSnow = f.findNext('snow');

        expect(nextSnow).toBeDefined();
        expect(nextSnow?.name).toBe('Snow');
        expect(nextSnow?.startedAt.getTime()).toBe(expectedTime);
    });

    it('ignores the current window even if it matches', () => {
        jest.setSystemTime(1714764600000) // Fri May 03 2024 19:30:00 GMT+0000

        const expectedTime = 1714767600000 // Fri May 03 2024 20:20:00 GMT+0000

        const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PYROS);

        expect(f.current()).toBe('Heat Waves');

        const nextHeatWaves = f.findNext('Heat Waves');

        expect(nextHeatWaves).toBeDefined();
        expect(nextHeatWaves?.name).toBe('Heat Waves');
        expect(nextHeatWaves?.startedAt.getTime()).toBe(expectedTime);
    });

    it('skips back-to-back weather blocks', () => {
        jest.setSystemTime(1714761600000) // Fri May 03 2024 18:40:00 GMT+0000

        const expectedTime = 1714764800000 // Fri May 03 2024 19:33:20 GMT+0000

        const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

        expect(f.current()).toBe('Blizzards');

        const nextBlizzards = f.findNext('Blizzards');

        expect(nextBlizzards).toBeDefined();
        expect(nextBlizzards?.name).toBe('Blizzards');
        expect(nextBlizzards?.startedAt.getTime()).toBe(expectedTime);
    });

    it('throws an error when an invalid zone is passed', () => {
        const t = () => {
            new Forecast("NotAZone");
        }

        expect(t).toThrow(TypeError);
    });
});
