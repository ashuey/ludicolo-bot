import {Command as BaseCommand, CommandoClient} from "discord.js-commando";
import CommandInfo from "./Types/CommandInfo";
import * as _ from 'lodash'

export default abstract class Command extends BaseCommand {
    protected constructor(client: CommandoClient, info: CommandInfo) {
        info = _.extend({
            argsPromptLimit: 0
        }, info);
        super(client, info);
    }

    async run(msg, args) {
        const response = this.handle(msg, args);
        await msg.delete();
        return response;
    }

    protected abstract async handle(msg, args);
}