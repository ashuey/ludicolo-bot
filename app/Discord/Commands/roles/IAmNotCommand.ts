import Command from "@ashuey/ludicolo-discord/lib/Command";
import {Message, MessageEmbed, Role} from "discord.js";
import {CommandoMessage} from "discord.js-commando";
import * as _ from "lodash";

export default class AddSARCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'iamnot',
            group: 'roles',
            memberName: 'iamnot',
            description: 'Leaves a self-assignable role',
            guildOnly: true,
            clientPermissions: ['MANAGE_ROLES'],

            args: [
                {
                    key: 'role',
                    prompt: 'What role would you like to leave?',
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

        await msg.member.removeRole(args.role);

        return this.sendSuccessResponse(msg, args.role);
    }

    // noinspection JSMethodCanBeStatic
    sendSuccessResponse(msg: CommandoMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** you no longer have the **${role.name}** role.`));
    }

    // noinspection JSMethodCanBeStatic
    sendFailedResponse(msg: CommandoMessage, role: Role): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`The role **${role.name}** is not self-assignable`));
    }
}