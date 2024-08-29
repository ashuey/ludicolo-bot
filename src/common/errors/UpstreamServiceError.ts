import { RuntimeError } from "@/common/errors/RuntimeError";

export class UpstreamServiceError extends RuntimeError {
    constructor() {
        super("A third-party service we need for that command is having issues right now. Please try again later.");
    }
}
