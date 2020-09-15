import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import ScreeningReminder from "../../../ScreeningReminder";

export default class ScreeningRemindersCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'screeningreminders',
            group: 'misc',
            memberName: 'screeningreminders',
            description: 'Set up screening reminders',
        });
    }

    async handle(msg: CommandoMessage) {
        let screeningReminder = await ScreeningReminder.query().findOne('user', msg.author.id);

        if (screeningReminder) {
            return msg.reply("Screening reminders are already set up for your account!")
        }

        await ScreeningReminder.query().insert({
            user: msg.author.id
        });

        return msg.reply("Screening reminders are now enabled");
    }
}