import axios, { AxiosInstance } from "axios";
import { Result } from "@/common/Result";

export class InspiroBot {
    static readonly ENDPOINT = "https://inspirobot.me/api?generate=true";

    protected readonly http: AxiosInstance;

    constructor() {
        this.http = axios.create({
            timeout: 2000,
            validateStatus: () => true,
        });
    }

    public async newImage(): Promise<Result<string>> {
        const result = await this.http.get<string>(InspiroBot.ENDPOINT);

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        return [true, result.data];
    }
}

export const inspiroBot = new InspiroBot();
