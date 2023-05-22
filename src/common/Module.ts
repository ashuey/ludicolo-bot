import { Command } from "@/common/Command";
import { Migration } from "@/common/Migration";

export interface Module {
    readonly commands: Command[];
    readonly migrations: Migration[];
}
