import Command from "@ashuey/ludicolo-discord/lib/Command";
import * as _ from 'lodash'
import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed, Role} from "discord.js";

export default class AddSARCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-sar',
            aliases: ['asar'],
            group: 'roles',
            memberName: 'add-sar',
            description: 'Add a self-assignable role',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],

            args: [
                {
                    key: 'role',
                    prompt: 'What role would you like to add?',
                    type: 'role'
                }
            ]
        })
    }

    async handle(msg, args) {
        const roleId = args.role.id;

        const guildSAR = await msg.guild.settings.get('sar', []);

        if (_.includes(guildSAR, roleId)) {
            return this.sendFailedResponse(msg, args.role);
        }

        guildSAR.push(roleId);

        await msg.guild.settings.set('sar', guildSAR);

        return this.sendSuccessResponse(msg, args.role);
    }

    // noinspection JSMethodCanBeStatic
    sendSuccessResponse(msg: CommandMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`Role **${role.name}** has been added to the list of self-assignable roles.`));
    }

    // noinspection JSMethodCanBeStatic
    sendFailedResponse(msg: CommandMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`The role **${role.name}** is already self-assignable`));
    }
}