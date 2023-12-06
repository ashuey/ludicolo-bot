import axios from "axios";
import { Result } from "@/common/Result";
import { TextGenerationParameters } from "@/modules/ai/huggingface/TextGenerationParameters";
import { TextGenerationResult } from "@/modules/ai/huggingface/TextGenerationResult";

export class HuggingFace {
    static readonly URL_BASE = "https://api-inference.huggingface.co";

    protected readonly http;

    constructor(apiKey: string) {
        this.http = axios.create({
            timeout: 60000,
            baseURL: HuggingFace.URL_BASE,
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            validateStatus: () => true,
        });
    }

    async query<T>(modelId: string, payload?: unknown): Promise<Result<T>> {
        const result = await this.http.post<T>(`models/${modelId}`, payload);

        if (result.status < 200 || result.status >= 300) {
            return [false, new Error(`HTTP Error ${result.status}`)];
        }

        return [true, result.data];
    }

    async textGeneration(modelId: string, payload: TextGenerationParameters) {
        return this.query<TextGenerationResult>(modelId, payload);
    }
}
