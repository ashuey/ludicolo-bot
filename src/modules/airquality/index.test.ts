import {AirQualityModule} from "@/modules/airquality/index";
import {AirNow} from "@/modules/airquality/airnow";

describe('AirQualityModule', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create and return a new AirNow instance if not already present', () => {
        const airQualityModule = new AirQualityModule({
            config: {
                airNowApiKey: '',
            }
        } as never);
        const api = airQualityModule.airNow;
        expect(api).toBeInstanceOf(AirNow);
        expect(api).toBe(airQualityModule.airNow);
    });
});
