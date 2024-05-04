import {forecastIsAlertable, TWENTY_MINUTES} from "@/modules/ffxiv/tasks/eureka-weather";
import {ForecastEntry} from "@/modules/ffxiv/Forecast";

describe('eureka-weather', () => {
    it('twenty minutes is twenty minutes', () => {
        const startTime = 1714791600000; // Sat May 04 2024 03:00:00 GMT+0000
        const expectedTime = 1714792800000; // Sat May 04 2024 03:20:00 GMT+0000

        expect(startTime + TWENTY_MINUTES).toBe(expectedTime);
    });

    describe('forecastIsAlertable', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it('alerts for events within twenty minutes', () => {
            jest.setSystemTime(1714782630000) // Sat May 04 2024 00:30:30 GMT+0000

            const forecast: ForecastEntry = {
                name: 'Snow',
                startedAt: new Date(1714782640000), // Sat May 04 2024 00:30:40 GMT+0000
            }

            expect(forecastIsAlertable(forecast, 0)).toBe(true);
        });

        it('does not alert for events more than twenty minutes in the future', () => {
            jest.setSystemTime(1714742400000) // Fri May 03 2024 13:20:00 GMT+0000

            const forecast: ForecastEntry = {
                name: 'Snow',
                startedAt: new Date(1714744560000), // Fri May 03 2024 13:56:00 GMT+0000
            }

            expect(forecastIsAlertable(forecast, 0)).toBe(false);
        });

        it('does not alert for events that have already been alerted', () => {
            jest.setSystemTime(1714749120000) // Fri May 03 2024 15:12:00 GMT+0000

            const forecast: ForecastEntry = {
                name: 'Snow',
                startedAt: new Date(1714749600000), // Fri May 03 2024 15:20:00 GMT+0000
            }

            expect(forecastIsAlertable(forecast, 1714749600000)).toBe(false);
        });
    })
});
