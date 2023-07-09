import axios from "axios";
import { Observation } from "@/modules/airquality/airnow/Observation";
import { Result } from "@/common/Result";
import { Forecast } from "@/modules/airquality/airnow/Forecast";

export class AirNow {
    static readonly URL_BASE = "https://www.airnowapi.org";

    protected readonly http;

    constructor(apiKey: string) {
        this.http = axios.create({
            timeout: 2000,
            baseURL: AirNow.URL_BASE,
            params: {
                'API_KEY': apiKey,
                'format': 'application/json',
            }
        });
    }

    public async currentObservation(zip: string, distance = 50): Promise<Result<Observation[]>> {
        const result = await this.http.get<Observation[]>('aq/observation/zipCode/current', {
            params: {
                'zipCode': zip,
                'distance': distance,
            }
        });

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        return [true, result.data];
    }

    public async historicalObservations(
        zip: string,
        date: string,
        distance = 50
    ): Promise<Result<Observation[]>> {
        const result = await this.http.get<Observation[]>('aq/observation/zipCode/historical', {
            params: {
                'zipCode': zip,
                'date': date,
                'distance': distance,
            }
        });

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        return [true, result.data];
    }

    public async forecasts(
        zip: string,
        date: string | null = null,
        distance = 50
    ): Promise<Result<Forecast[]>> {
        const params: Record<string, string> = {
            'zipCode': zip,
            'distance': String(distance),
        };

        if (date) {
            params['date'] = date;
        }

        const result = await this.http.get<Forecast[]>('aq/forecast/zipCode', {
            params,
        });

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        return [true, result.data];
    }
}
