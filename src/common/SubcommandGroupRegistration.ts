import {SubcommandGroup} from "@/common/SubcommandGroup";
import {Subcommand} from "@/common/Subcommand";

export interface SubcommandGroupRegistration {
    subcommandGroup: SubcommandGroup;
    subcommands: Map<string, Subcommand>;
}
