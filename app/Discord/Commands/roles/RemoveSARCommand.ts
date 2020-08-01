import Command from "@ashuey/ludicolo-discord/lib/Command";
import * as _ from 'lodash'
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, Role } from "discord.js";

export default class RemoveSARCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'remove-sar',
            aliases: ['rsar', 'delete-sar', 'dsar'],
            group: 'roles',
            memberName: 'remove-sar',
            description: 'Removes a self-assignable role',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],

            args: [
                {
                    key: 'role',
                    prompt: 'What role would you like to remove?',
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

        _.pull(guildSAR, roleId);

        await msg.guild.settings.set('sar', guildSAR);

        return this.sendSuccessResponse(msg, args.role);
    }

    // noinspection JSMethodCanBeStatic
    sendSuccessResponse(msg: CommandoMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`Role **${role.name}** has been removed from the list of self-assignable roles.`));
    }

    // noinspection JSMethodCanBeStatic
    sendFailedResponse(msg: CommandoMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`The role **${role.name}** is not self-assignable.`));
    }
}