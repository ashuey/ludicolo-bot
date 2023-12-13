import { HfInference } from "@huggingface/inference";

export interface HuggingFaceProvider {
    huggingFace: HfInference;
}
