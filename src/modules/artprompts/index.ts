import { Module } from "@/common/Module";
import { ArtPromptCommand } from "@/modules/artprompts/commands/prompt";

export class ArtPromptModule implements Module {
    readonly commands = [
        new ArtPromptCommand(),
    ];

    readonly migrations = [];
}
