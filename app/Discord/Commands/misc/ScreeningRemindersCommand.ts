import Command from "@ashuey/ludicolo-discord/lib/Command";
import {CommandoMessage} from "discord.js-commando";
import { Role, TextChannel } from "discord.js";

interface CommandArguments {
    role: Role
}

export default class ScreeningRemindersCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'screeningreminders',
            group: 'misc',
            memberName: 'screeningreminders',
            description: 'Sets up screening reminders in the current channel',
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    key: 'role',
                    label: 'Role',
                    prompt: '',
                    type: 'role'
                }
            ]
        })
    }

    async handle(msg: CommandoMessage, args: CommandArguments) {
        const channel = msg.channel as TextChannel;

        await msg.guild.settings.set('screening_reminder_channel', channel.id);
        await msg.guild.settings.set('screening_reminder_role', args.role.id);

        return msg.say(`Screening reminders will now be sent daily to **${args.role.name}** in **${channel.name}**`);
    }
}