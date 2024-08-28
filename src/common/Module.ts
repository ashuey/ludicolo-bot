import { Knex } from "knex";
import { Command } from "@/common/Command";
import { ComponentHandler } from "@/common/ComponentHandler";
import {ScheduledTask} from "@/common/ScheduledTask";

export interface Module {
    readonly name: string;
    readonly commands?: Command[];
    readonly componentHandlers?: [string, ComponentHandler][];
    readonly scheduledTasks?: [string, ScheduledTask][];
    readonly migrations?: [string, Knex.Migration['up']][];
    bootstrap?: () => Promise<unknown>
    shutdown?: () => void;
}
