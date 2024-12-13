import { Module } from "@/common/Module";
import { ShikiCommand } from "@/modules/random/commands/shiki";
import { PingCommand } from "@/modules/random/commands/ping";

export class RandomModule implements Module {
    readonly name = 'random';

    readonly commands = [
        new ShikiCommand(),
        new PingCommand(),
    ];
}
