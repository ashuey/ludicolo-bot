import Command from "../../../../framework/Discord/Command";
import * as _ from 'lodash'
import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed, Role} from "discord.js";

export default class RemoveSARCommand extends Command {
    constructor(client) {
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

    async handle(msg, args) {
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
    sendSuccessResponse(msg: CommandMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`Role **${role.name}** has been removed from the list of self-assignable roles.`));
    }

    // noinspection JSMethodCanBeStatic
    sendFailedResponse(msg: CommandMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`The role **${role.name}** is not self-assignable.`));
    }
}