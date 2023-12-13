import {
    HfInference,
    InferenceOutputError,
    Options,
    TextGenerationArgs,
    TextGenerationOutput
} from "@huggingface/inference";

// Modified text generation function to support multiple responses
export async function textGeneration(hf: HfInference, args: TextGenerationArgs, options?: Options): Promise<TextGenerationOutput[]> {
    const res = await hf.request<TextGenerationOutput[]>(args, {
        ...options,
        taskHint: "text-generation",
    });
    const isValidOutput = Array.isArray(res) && res.every((x) => typeof x?.generated_text === "string");
    if (!isValidOutput) {
        throw new InferenceOutputError("Expected Array<{generated_text: string}>");
    }
    return res;
}
