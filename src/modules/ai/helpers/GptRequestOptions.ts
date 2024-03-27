export interface GptRequestOptions {
    temperature?: number | null;
    max_tokens?: number | null;
    top_p?: number | null;
    frequency_penalty?: number | null;
    presence_penalty?: number | null;
}
