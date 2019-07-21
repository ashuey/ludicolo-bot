import Command from "../../../../framework/Discord/Command";
import {Message, RichEmbed, Role} from "discord.js";
import {CommandMessage} from "discord.js-commando";
import * as _ from "lodash";

export default class AddSARCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'iam',
            group: 'roles',
            memberName: 'iam',
            description: 'Join a self-assignable role',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],

            args: [
                {
                    key: 'role',
                    prompt: 'What role would you like to join?',
                    type: 'role'
                }
            ]
        })
    }

    async run(msg, args) {
        const roleId = args.role.id;

        const guildSAR = await msg.guild.settings.get('sar');

        if (!_.includes(guildSAR, roleId)) {
            return this.sendFailedResponse(msg, args.role);
        }

        await msg.member.addRole(args.role);

        return this.sendSuccessResponse(msg, args.role);
    }

    // noinspection JSMethodCanBeStatic
    sendSuccessResponse(msg: CommandMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** you now have the **${role.name}** role.`));
    }

    // noinspection JSMethodCanBeStatic
    sendFailedResponse(msg: CommandMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`The role **${role.name}** is not self-assignable`));
    }
}