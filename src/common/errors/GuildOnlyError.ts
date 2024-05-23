import { RuntimeError } from "@/common/errors/RuntimeError";

export class GuildOnlyError extends RuntimeError {
    constructor() {
        super("This command can only be run in a guild.");
    }
}
