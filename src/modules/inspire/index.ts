import { Module } from "@/common/Module";
import { InspireCommand } from "@/modules/inspire/commands/inspire";

export class InspireModule implements Module {
    readonly commands = [
        new InspireCommand()
    ];

    readonly migrations = [];
}
