import { Module } from "@/common/Module";
import { ShikiCommand } from "@/modules/random/commands/shiki";

export class RandomModule implements Module {
    readonly name = 'random';

    readonly commands = [
        new ShikiCommand(),
    ];
}
