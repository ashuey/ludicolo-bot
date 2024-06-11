import { Module } from "@/common/Module";
import { TriviaHintCommand } from "@/modules/djtrivia/commands/hint";

export class DJTriviaModule implements Module {
    readonly name = 'dj_trivia';

    readonly commands = [
        new TriviaHintCommand(),
    ];

    readonly migrations = [];
}
