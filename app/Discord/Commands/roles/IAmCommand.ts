import Command from "@ashuey/ludicolo-discord/lib/Command";
import {Message, MessageEmbed, Role} from "discord.js";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import * as _ from "lodash";

export default class AddSARCommand extends Command {
    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: { role: Role }) {
        const roleId = args.role.id;

        const guildSAR = await msg.guild.settings.get('sar', []);

        if (!_.includes(guildSAR, roleId)) {
            return this.sendFailedResponse(msg, args.role);
        }

        await msg.member.roles.add(args.role);

        return this.sendSuccessResponse(msg, args.role);
    }

    // noinspection JSMethodCanBeStatic
    sendSuccessResponse(msg: CommandoMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** you now have the **${role.name}** role.`));
    }

    // noinspection JSMethodCanBeStatic
    sendFailedResponse(msg: CommandoMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`The role **${role.name}** is not self-assignable`));
    }
}