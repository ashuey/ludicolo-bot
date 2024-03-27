import { Command } from "@/common/Command";
import { ComponentHandler } from "@/common/ComponentHandler";

export interface Module {
    readonly commands?: Command[];
    readonly componentHandlers?: [string, ComponentHandler][];
}
