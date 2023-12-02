import { Command } from "@/common/Command";
import { Migration } from "@/common/Migration";
import { ComponentHandler } from "@/common/ComponentHandler";

export interface Module {
    readonly commands: Command[];
    readonly migrations: Migration[];
    readonly componentHandlers?: [string, ComponentHandler][];
}
