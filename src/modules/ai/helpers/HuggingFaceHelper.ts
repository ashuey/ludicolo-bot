import { textGeneration } from "@/modules/ai/huggingFace";
import { HuggingFaceProvider } from "@/modules/ai/HuggingFaceProvider";

export class HuggingFaceHelper {
    protected readonly module: HuggingFaceProvider;

    constructor(module: HuggingFaceProvider) {
        this.module = module;
    }

    public async textGeneration(prompt: string, iterations = 2): Promise<string> {
        for (let i = 0; i < iterations; i++) {
            prompt = await this.completion(prompt);
        }

        if (prompt.length > 1960) {
            prompt = prompt.substring(0, 1960);
            prompt = prompt.substring(0, Math.min(prompt.length, prompt.lastIndexOf(" ")));
        }

        return prompt;
    }

    protected async completion(input: string): Promise<string> {
        const result = await textGeneration(this.module.huggingFace, {
            model: 'gpt2',
            inputs: input,
            parameters: {
                //repetition_penalty: 2.0,
                max_new_tokens: 250,
                max_time: 60,
                //top_k: 20,
                //top_p: 20,
                num_return_sequences: 6,
                do_sample: true,
                temperature: 1.4
            }
        }, {
            use_cache: false
        });

        let candidates = result.filter(r => r.generated_text.length <= 1960);
        if (candidates.length == 0) {
            candidates = result;
        }

        const longest = candidates.reduce(
            (a, b) => a.generated_text.length > b.generated_text.length ? a : b
        );

        return longest.generated_text;
    }
}
