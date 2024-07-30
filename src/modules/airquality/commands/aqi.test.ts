import {AQICommand} from "@/modules/airquality/commands/aqi";
import {AirNow} from "@/modules/airquality/airnow";

class AirNowTest extends AirNow {
    private callIdx = 0;

    private responses: unknown[] = [
        [{"DateObserved":"2024-07-26","HourObserved":13,"LocalTimeZone":"EST","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":28,"Category":{"Number":1,"Name":"Good"}},{"DateObserved":"2024-07-26","HourObserved":13,"LocalTimeZone":"EST","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":37,"Category":{"Number":1,"Name":"Good"}}],
        [{"DateIssue":"2024-07-26","DateForecast":"2024-07-26","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":32,"Category":{"Number":1,"Name":"Good"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-26","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":38,"Category":{"Number":1,"Name":"Good"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-27","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":48,"Category":{"Number":1,"Name":"Good"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-27","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":53,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-28","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":51,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-28","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":55,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-29","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":51,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-29","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":60,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""}],
        [{"DateIssue":"2024-07-26","DateForecast":"2024-07-27","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":48,"Category":{"Number":1,"Name":"Good"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-27","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":53,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-28","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":51,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-28","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":55,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-29","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"O3","AQI":51,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""},{"DateIssue":"2024-07-26","DateForecast":"2024-07-29","ReportingArea":"Eastern Lake Ontario Region","StateCode":"NY","Latitude":43.5263,"Longitude":-76.8398,"ParameterName":"PM2.5","AQI":60,"Category":{"Number":2,"Name":"Moderate"},"ActionDay":false,"Discussion":""}],
    ]

    setupTests() {
        const adapterFn = jest.fn(async (config) => {
            const responseData = this.responses[this.callIdx];
            this.callIdx += 1;
            return {
                data: responseData,
                status: 200,
                statusText: '',
                headers: {},
                config: config
            }
        });
        this.http.defaults.adapter = adapterFn;
        return adapterFn
    }
}

describe('aqi command', () => {
    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    })

    it('returns the expected response', async () => {
        jest.useFakeTimers();
        jest.setSystemTime(1722020988000) // Friday, July 26, 2024 3:09:48 PM GMT-04:00

        const replyFn = jest.fn();
        const airNow = new AirNowTest('');
        airNow.setupTests()
        const cmd = new AQICommand({
            airNow,
        });

        await cmd.execute({
            reply: replyFn,
            options: {
                getInteger: () => 14612,
            }
        } as never);

        expect(replyFn.mock.calls[0][0].embeds[0].toJSON()).toMatchSnapshot();
    })
})
