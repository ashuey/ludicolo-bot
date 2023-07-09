import { Module } from "@/common/Module";
import { TriviaHintCommand } from "@/modules/djtrivia/commands/hint";

export class DJTriviaModule implements Module {
    readonly commands = [
        new TriviaHintCommand(),
    ];

    readonly migrations = [];
}
