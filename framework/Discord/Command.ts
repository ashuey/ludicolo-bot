import {Command as BaseCommand, CommandoClient} from "discord.js-commando";
import CommandInfo from "./Types/CommandInfo";

export default class Command extends BaseCommand {
    constructor(client: CommandoClient, info: CommandInfo) {
        super(client, info);
    }
}