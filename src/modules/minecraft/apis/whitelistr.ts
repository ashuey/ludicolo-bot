import axios from "axios";
import { Result } from "@/common/Result";

type WhitelistrResponse = { success: true } | { success: false, error: string };

export class Whitelistr {
    protected readonly endpoint: string;

    protected readonly apiKey: string;

    protected readonly http;

    constructor(endpoint: string, apiKey: string) {
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.http = axios.create({
            timeout: 2000,
            validateStatus: () => true,
        });
    }

    public async whitelistUser(username: string): Promise<Result<null>> {
        const formData = new FormData();
        formData.set('api_key', this.apiKey);
        formData.set('username', username);
        const result = await this.http.post<WhitelistrResponse>(this.endpoint, formData);

        if (result.data.success === true) {
            return [true, null];
        }

        return [false, new Error(`Whitelistr error: ${result.data.error}`)];
    }
}
