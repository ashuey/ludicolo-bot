import Command from "@ashuey/ludicolo-discord/lib/Command";
import {MessageEmbed} from "discord.js";
import * as _ from 'lodash';
import { CommandoClient, CommandoMessage } from "discord.js-commando";

export default class ListSARCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'sar-auto-clean',
            group: 'roles',
            memberName: 'sar-auto-clean',
            description: 'Removes deleted roles from the self-assignable role list',
            guildOnly: true,
            userPermissions: ['MANAGE_ROLES'],
        })
    }

    async handle(msg: CommandoMessage) {
        const guildSAR = await msg.guild.settings.get('sar', []);

        let guildSARLength = guildSAR.length;

        const newGuildSAR = _.filter(guildSAR, function (sar) {
            return !!msg.guild.roles.resolve(sar);
        });

        await msg.guild.settings.set('sar', newGuildSAR);

        guildSARLength = guildSARLength - newGuildSAR.length;

        const roles = guildSARLength == 1 ? 'role' : 'roles';

        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`Removed ${guildSARLength} deleted ${roles} from the self-assignable roles list`));
    }
}