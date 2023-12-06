export interface TextGenerationParameters {
    inputs: string;
    parameters?: {
        top_k?: number;
        top_p?: number;
        temperature?: number;
        repetition_penalty?: number;
        max_new_tokens?: number;
        max_time?: number;
        return_full_text?: boolean;
    } & ({
        num_return_sequences?: number;
        do_sample?: true
    } | {
        num_return_sequences?: 1;
        do_sample?: false
    })
    options?: {
        use_cache?: boolean;
        wait_for_model?: boolean;
    }
}
