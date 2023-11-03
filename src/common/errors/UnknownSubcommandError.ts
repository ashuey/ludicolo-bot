import { RuntimeError } from "@/common/errors/RuntimeError";

export class UnknownSubcommandError extends RuntimeError {
    constructor() {
        super("Unrecognized subcommand. Perhaps commands need to be re-registered?");
    }
}
