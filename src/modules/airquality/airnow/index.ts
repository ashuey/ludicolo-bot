import axios from "axios";
import { Observation } from "@/modules/airquality/airnow/Observation";

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

    public async currentObservation(zip: string, distance = 50): Promise<Observation[]> {
        return (await this.http.get('aq/observation/zipCode/current', {
            params: {
                'zipCode': zip,
                'distance': distance,
            }
        })).data;
    }
}
