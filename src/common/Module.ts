import { Command } from "@/common/Command";
import { ComponentHandler } from "@/common/ComponentHandler";
import {ScheduledTask} from "@/common/ScheduledTask";

export interface Module {
    readonly commands?: Command[];
    readonly componentHandlers?: [string, ComponentHandler][];
    readonly scheduledTasks?: [string, ScheduledTask][];
}
