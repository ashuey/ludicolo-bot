import {Command as BaseCommand, CommandoClient} from "discord.js-commando";
import CommandInfo from "./Types/CommandInfo";
import * as _ from 'lodash'

export default class Command extends BaseCommand {
    constructor(client: CommandoClient, info: CommandInfo) {
        info = _.extend({
            argsPromptLimit: 0
        }, info);
        super(client, info);
    }
}