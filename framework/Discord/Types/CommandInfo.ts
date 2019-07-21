import { CommandInfo as BaseCommandInfo } from "discord.js-commando";
import { PermissionResolvable } from "discord.js";

export default interface CommandInfo extends BaseCommandInfo {
    clientPermissions?: PermissionResolvable[];
    userPermissions?: PermissionResolvable[];

}