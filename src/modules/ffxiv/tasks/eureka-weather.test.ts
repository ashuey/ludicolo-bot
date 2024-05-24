import {
    forecastIsAlertable,
    resetLastSent,
    sendEurekaWeather,
    TWENTY_MINUTES
} from "@/modules/ffxiv/tasks/eureka-weather";
import {ForecastEntry} from "@/modules/ffxiv/weather/ForecastEntry";
import {ApplicationProvider} from "@/common/ApplicationProvider";

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
    });

    describe('refactor snapshots', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.useRealTimers();
            jest.restoreAllMocks();
            resetLastSent();
        });

        const tests: [number, number][] = [
            [1716460123534, 0],
            [1716483013917, 1],
            [1716487212135, 1],
            [1716488596352, 1],
        ];

        test.each(tests)("Returns the correct resonse when time is %p", async (ts, sendTimes) => {
            jest.setSystemTime(ts);

            const sendMock = jest.fn((_) => Promise.resolve());

            const mockModule = {
                app: {
                    discord: {
                        channels: {
                            fetch: () => Promise.resolve({
                                isTextBased: () => true,
                                send: sendMock,
                            })
                        }
                    }
                }
            }

            await sendEurekaWeather(mockModule as unknown as ApplicationProvider);

            expect(sendMock).toHaveBeenCalledTimes(sendTimes);
            expect(sendMock.mock.calls).toMatchSnapshot();
        })
    })
});
