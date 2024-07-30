import EorzeaWeather from "eorzea-weather";
import {Forecast} from "@/modules/ffxiv/Forecast";

class ForecastTest extends Forecast {
    getEorzeaWeather() {
        return this.eorzeaWeather;
    }
}

describe('Forecast', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('throws an error when an invalid zone is passed', () => {
        const t = () => {
            new Forecast("NotAZone");
        }

        expect(t).toThrow(TypeError);
    });

    describe('findNext', () => {
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
    });

    describe('findPrevious', () => {
        it('looks back at 18 windows', () => {
            const f = new ForecastTest(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const mock = jest.spyOn(f.getEorzeaWeather(), 'getWeather');

            const previous = f.findPrevious({
                name: 'fake-weather',
                startedAt: new Date(1716405600000),
            }, true, 18);

            expect(previous).toBeUndefined();
            expect(mock).toHaveBeenCalledTimes(18);
        });

        it('looks back at 18 windows when startOfWindow is false', () => {
            const f = new ForecastTest(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const mock = jest.spyOn(f.getEorzeaWeather(), 'getWeather');

            const previous = f.findPrevious({
                name: 'fake-weather',
                startedAt: new Date(1716405600000),
            }, false, 18);

            expect(previous).toBeUndefined();
            expect(mock).toHaveBeenCalledTimes(18);
        });

        it('find the previous weather window', () => {
            const expectedTime = 1716416800000; // Wed May 22 2024 22:26:40 GMT+0000

            const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const previousThunder = f.findPrevious({
                name: 'Thunder',
                startedAt: new Date(1716428000000), // Thu May 23 2024 01:33:20 GMT+0000
            });

            expect(previousThunder).toBeDefined();
            expect(previousThunder?.name).toBe('Thunder');
            expect(previousThunder?.startedAt.getTime()).toBe(expectedTime);
        });

        it('find the previous weather window when startOfWindow is false', () => {
            const expectedTime = 1716416800000; // Wed May 22 2024 22:26:40 GMT+0000

            const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const previousThunder = f.findPrevious({
                name: 'Thunder',
                startedAt: new Date(1716428000000), // Thu May 23 2024 01:33:20 GMT+0000
            }, false);

            expect(previousThunder).toBeDefined();
            expect(previousThunder?.name).toBe('Thunder');
            expect(previousThunder?.startedAt.getTime()).toBe(expectedTime);
        });

        it('find the previous weather window during a double', () => {
            const expectedTime = 1716407000000; // Wed May 22 2024 19:43:20 GMT+0000

            const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const previousThunder = f.findPrevious({
                name: 'Heat Waves',
                startedAt: new Date(1716423800000), // Thu May 23 2024 00:23:20 GMT+0000
            });

            expect(previousThunder).toBeDefined();
            expect(previousThunder?.name).toBe('Heat Waves');
            expect(previousThunder?.startedAt.getTime()).toBe(expectedTime);
        });

        it('find the previous weather window during a double when startOfWindow is false', () => {
            const expectedTime = 1716407000000; // Wed May 22 2024 19:43:20 GMT+0000

            const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const previousThunder = f.findPrevious({
                name: 'Heat Waves',
                startedAt: new Date(1716423800000), // Thu May 23 2024 00:23:20 GMT+0000
            }, false);

            expect(previousThunder).toBeDefined();
            expect(previousThunder?.name).toBe('Heat Waves');
            expect(previousThunder?.startedAt.getTime()).toBe(expectedTime);
        });

        it('find the previous weather window when the previous window is a double', () => {
            const expectedTime = 1716418200000; // Wed May 22 2024 22:50:00 GMT+0000

            const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const previousThunder = f.findPrevious({
                name: 'Fog',
                startedAt: new Date(1716430800000), // Thu May 23 2024 02:20:00 GMT+0000
            });

            expect(previousThunder).toBeDefined();
            expect(previousThunder?.name).toBe('Fog');
            expect(previousThunder?.startedAt.getTime()).toBe(expectedTime);
        });

        it('find the previous weather window when the previous window is a double and startOfWindow is false', () => {
            const expectedTime = 1716419600000; // Wed May 22 2024 23:13:20 GMT+0000

            const f = new Forecast(EorzeaWeather.ZONE_EUREKA_PAGOS);

            const previousThunder = f.findPrevious({
                name: 'Fog',
                startedAt: new Date(1716430800000), // Thu May 23 2024 02:20:00 GMT+0000
            }, false);

            expect(previousThunder).toBeDefined();
            expect(previousThunder?.name).toBe('Fog');
            expect(previousThunder?.startedAt.getTime()).toBe(expectedTime);
        });
    })
});
